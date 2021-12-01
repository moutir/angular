import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { UploadLayoutTypeEnum } from '../../enum/upload-layout-type.enum';
import { UploadStrategyInterface } from '../../interface/upload-strategy.interface';
import { UploadService } from '../../../core/shared/upload.service';
import { UploadModel } from '../../model/upload.model';
import { NotificationTypeEnum } from '../../enum/notification-type.enum';
import { UploadStatusEnum } from '../../enum/upload-status.enum';

@Component({
  selector: 'app-shared-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit, OnDestroy {

  /**
   * Uploader UID
   */
  @Input() uid: string = '';

  /**
   * Strategy
   */
  @Input() strategy: UploadStrategyInterface|null = null;

  /**
   * Is the upload layout disabled ?
   */
  @Input() isDisabled: boolean = false;

  /**
   * DOM element: File input
   */
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef<HTMLInputElement>;

  /**
   * Upload started
   */
  @Output() uploadStart: EventEmitter<UploadModel[]> = new EventEmitter<UploadModel[]>();

  /**
   * Upload progressing
   */
  @Output() uploadProgress: EventEmitter<UploadModel[]> = new EventEmitter<UploadModel[]>();

  /**
   * Upload completed
   */
  @Output() uploadComplete: EventEmitter<UploadModel[]> = new EventEmitter<UploadModel[]>();

  /**
   * Layout types
   */
  layoutTypeImage: UploadLayoutTypeEnum = UploadLayoutTypeEnum.image;

  /**
   * Is there any files dragged over the container ?
   */
  isActiveDragover: boolean = false;

  /**
   * Progressing uploads
   */
  progressingUploads: UploadModel[] = [];

  /**
   * Active file UIDs
   */
  private activeFileUids: string[] = [];

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private uploadService: UploadService,
    private translateService: TranslateService,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    if (!this.uid) {

      console.error('Please set uploader UID');
    }

    // Upload subscription
    this.subscriptions.push(
      this.uploadService.selectUploads(this.uid).subscribe(uploads => this.onNextUploads(uploads)),
    );
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Body dragover
   */
  @HostListener('body:dragover', ['$event'])
  onBodyDragOver(event: DragEvent): void {

    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Body drop
   */
  @HostListener('body:drop', ['$event'])
  onBodyDrop(event: DragEvent): void {

    event.preventDefault();
  }

  /**
   * Files changed
   */
  onFilesChanged(event: Event): void {

    this.upload(this.fileInput.nativeElement.files);
  }

  /**
   * Drag enter on container
   */
  onDragEnter(event: DragEvent): void {

    event.preventDefault();

    this.isActiveDragover = true;
  }

  /**
   * Drag over on container
   */
  onDragOver(event: DragEvent): void {

    event.preventDefault();

    this.isActiveDragover = true;
  }

  /**
   * Drag leave on container
   */
  onDragLeave(event: DragEvent): void {

    event.preventDefault();

    this.isActiveDragover = false;
  }

  /**
   * Drop file on container
   */
  onDrop(event: DragEvent): void {

    event.preventDefault();

    this.isActiveDragover = false;

    if (event.dataTransfer && event.dataTransfer.files) {

      this.upload(event.dataTransfer.files);
    }
  }

  /**
   * Clicked on upload container
   */
  onClickContainer(): void {

    if (this.strategy === null) {

      console.error('Upload strategy not defined in UploadComponent.');

      return;
    }

    // Do nothing for document layout type
    if (this.strategy.layoutType === UploadLayoutTypeEnum.document) {

      return;
    }

    this.fileInput.nativeElement.click();
  }

  /**
   * Clicked on button to select files
   */
  onClickButtonSelectFiles(): void {

    this.fileInput.nativeElement.click();
  }

  /**
   * Upload files
   */
  private upload(files: FileList): void {

    if (this.strategy === null) {

      console.error('Upload strategy not defined in UploadComponent.');

      return;
    }

    // Exceeded maximum file count
    if (files.length > this.strategy.maxFileCount) {

      this.uploadService.notification(
        NotificationTypeEnum.warning,
        this.translateService.instant(
          'label_upload_warning_max_count_limit',
          { count: this.strategy.maxFileCount },
        ),
      );

      return;
    }

    // Upload each files
    Array.from(files).forEach(file => {

      const sizeMb = 1048576;
      const maxFileSizeInBytes = this.strategy.maxFileSize * sizeMb;

      // Exceeded maximum file size
      if (file.size > maxFileSizeInBytes) {

        const message = this.translateService.instant(
          'label_upload_warning_max_size_limit',
          { file: file.name, size: (this.strategy.maxFileSize + 'MB') },
        );

        this.uploadService.notification(NotificationTypeEnum.warning, message);

        return;
      }

      // Generated file UID
      const fileUid = this.uploadService.generateFileUid(file);

      // Add UID to the list of active UIDs
      this.activeFileUids.push(fileUid);

      // Upload file
      this.uploadService.upload(this.uid, {
        uid: fileUid,
        file: file,
        strategy: this.strategy,
      });
    });

    // Reset file input value
    this.fileInput.nativeElement.value = null;
  }

  /**
   * Next uploads
   */
  private onNextUploads(uploads: UploadModel[]): void {

    // Reset
    this.progressingUploads = [];

    if (uploads.length === 0) {

      return;
    }

    const startedUploads = uploads.filter(u => u.status === UploadStatusEnum.started);
    const progressingUploads = uploads.filter(u => u.status === UploadStatusEnum.progressing);
    const completedUploads = uploads.filter(u => this.activeFileUids.indexOf(u.id) > -1 && u.status === UploadStatusEnum.completed);

    // Set progressing uploads
    this.progressingUploads = progressingUploads;

    if (startedUploads.length > 0) {

      this.uploadStart.emit(startedUploads);
    }

    if (progressingUploads.length > 0) {

      this.uploadProgress.emit(progressingUploads);
    }

    if (completedUploads.length > 0) {

      // Remove completed uploads from active file UIDs
      completedUploads.forEach(c => this.activeFileUids = this.activeFileUids.filter(uid => uid !== c.id));

      this.uploadComplete.emit(completedUploads);
    }
  }
}
