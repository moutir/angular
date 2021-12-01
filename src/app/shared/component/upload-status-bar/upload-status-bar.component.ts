import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { UploadModel } from '../../model/upload.model';
import { UploadService } from '../../../core/shared/upload.service';
import { UploadStatusEnum } from '../../enum/upload-status.enum';

@Component({
  selector: 'app-shared-upload-status-bar',
  templateUrl: './upload-status-bar.component.html',
  styleUrls: ['./upload-status-bar.component.scss'],
})
export class UploadStatusBarComponent implements OnChanges {

  /**
   * Uploads
   */
  @Input() uploads: UploadModel[];

  /**
   * Is the status bar folded?
   */
  @Input() isFolded: boolean;

  /**
   * Upload statuses
   */
  uploadStatusStarted: UploadStatusEnum = UploadStatusEnum.started;
  uploadStatusProgressing: UploadStatusEnum = UploadStatusEnum.progressing;
  uploadStatusFailed: UploadStatusEnum = UploadStatusEnum.failed;
  uploadStatusCancelled: UploadStatusEnum = UploadStatusEnum.cancelled;
  uploadStatusCompleted: UploadStatusEnum = UploadStatusEnum.completed;

  /**
   * Header title
   */
  headerTitle: string = '';

  /**
   * Header title upload count
   */
  headerTitleUploadCount: number = 0;

  /**
   * Constructor
   */
  constructor(
    private uploadService: UploadService,
  ) {
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (changes && changes.uploads) {

      this.setHeaderTitle();
    }
  }

  /**
   * Clicked on button to cancel an upload
   */
  onClickCancel(uid: string): void {

    this.uploadService.cancel(uid);
  }

  /**
   * Clicked on button to cancel all uploads
   */
  onClickCancelAll(): void {

    this.uploadService.cancelAll();
  }

  /**
   * Clicked on button to toggle fold/unfold
   */
  onClickToggle(): void {

    this.uploadService.toggleStatusBar();
  }

  /**
   * Set header title
   */
  private setHeaderTitle(): void {

    // Progressing uploads
    const progressingUploads = this.uploads.filter(upload => upload.status === this.uploadStatusProgressing);

    if (progressingUploads.length > 0) {

      this.headerTitleUploadCount = progressingUploads.length;

      this.headerTitle = progressingUploads.length === 1 ?
        'label_upload_progress_count_singular' : 'label_upload_progress_count_plural';

      return;
    }

    // Incomplete uploads
    const incompleteUploads = this.uploads.filter(
      upload => upload.status === this.uploadStatusCancelled || upload.status === this.uploadStatusFailed,
    );

    if (incompleteUploads.length > 0) {

      this.headerTitleUploadCount = incompleteUploads.length;

      this.headerTitle = incompleteUploads.length === 1 ?
        'label_upload_fail_count_singular' : 'label_upload_fail_count_plural';

      return;
    }

    this.headerTitleUploadCount = this.uploads.length;

    // Completed downloads
    this.headerTitle = this.uploads.length === 1 ?
      'label_upload_complete_count_singular' : 'label_upload_complete_count_plural';
  }
}
