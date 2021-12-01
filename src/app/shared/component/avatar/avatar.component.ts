import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { UploadModel } from '../../model/upload.model';
import { ContactModel } from '../../model/contact.model';
import { ContactService } from '../../../core/shared/contact/contact.service';
import { UploadStrategyInterface } from '../../interface/upload-strategy.interface';
import { MimeTypeEnum } from '../../enum/mime-type.enum';
import { UploadLayoutTypeEnum } from '../../enum/upload-layout-type.enum';
import { DocumentTypeEnum } from '../../enum/document-type.enum';
import { EntityEnum } from '../../enum/entity.enum';

@Component({
  selector: 'app-shared-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnChanges {

  /**
   * Avatar UID
   */
  @Input() uid: string = '';

  /**
   * Contact model
   */
  @Input() contact: ContactModel = new ContactModel();

  /**
   * Upload strategy
   */
  uploadStrategy: UploadStrategyInterface = {
    fileTypes: [MimeTypeEnum.image],
    maxFileSize: 30,
    maxFileCount: 1,
    layoutType: UploadLayoutTypeEnum.image,
    isAllowedMultiple: false,
    documentType: DocumentTypeEnum.contactImage,
    entity: EntityEnum.contact,
    entityId: '',
    description: '',
  };

  /**
   * Constructor
   */
  constructor(
    private contactService: ContactService,
  ) {

  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    this.uploadStrategy = {
      ...this.uploadStrategy,
      entity: this.contact.entity,
      entityId: this.contact.id,
    };
  }

  /**
   * Avatar upload completed
   */
  onUploadComplete(uploads: UploadModel[]): void {

    const upload = uploads[0];

    if (!upload) {

      return;
    }

    // Set photo as avatar
    this.contactService.setAvatar(this.contact, upload);
  }

  /**
   * Clicked on button to remove avatar
   */
  onClickRemove(): void {

    this.contactService.removeAvatar(this.contact);
  }
}
