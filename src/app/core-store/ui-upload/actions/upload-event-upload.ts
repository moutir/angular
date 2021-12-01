import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { UploadInterface } from '../../../shared/interface/upload.interface';

export class UploadEventUpload implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event upload';
  readonly type: string = UploadEventUpload.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    upload: UploadInterface,
  }) {

  }
}
