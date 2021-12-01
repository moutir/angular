import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { UploadModel } from '../../model/upload.model';
import { UploadStrategyInterface } from '../../interface/upload-strategy.interface';
import { DocumentModel } from '../../model/document.model';

@Component({
  selector: 'app-shared-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnChanges {

  /**
   * UID
   */
  @Input() uid: string = '';

  /**
   * Image document
   */
  @Input() imageDocument: DocumentModel = new DocumentModel();

  /**
   * Upload strategy
   */
  @Input() uploadStrategy: UploadStrategyInterface|null = null;

  /**
   * Is the upload disabled ?
   */
  @Input() isDisabled: boolean = false;

  /**
   * Image width
   */
  @Input() width: number;

  /**
   * Image height
   */
  @Input() height: number;

  /**
   * Upload completed
   */
  @Output() uploadComplete: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();

  /**
   * Image removed
   */
  @Output() removeImage: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();

  /**
   * Constructor
   */
  constructor() {

  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (changes && changes.imageDocument && !changes.imageDocument.currentValue) {

      this.imageDocument = new DocumentModel();
    }
  }

  /**
   * Upload completed
   */
  onUploadComplete(uploads: UploadModel[]): void {

    const upload = uploads[0];

    if (!upload) {

      return;
    }

    const document = new DocumentModel();
    document.id = upload.fileId;
    document.name = upload.name;
    document.photoSmallURL = upload.thumbnailUrl;

    this.uploadComplete.emit(document);
  }

  /**
   * Clicked on the button to remove image
   */
  onClickRemove(): void {

    this.removeImage.emit(this.imageDocument);
  }
}
