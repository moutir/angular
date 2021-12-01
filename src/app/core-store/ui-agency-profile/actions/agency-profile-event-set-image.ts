import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { DocumentModel } from '../../../shared/model/document.model';

export class AgencyProfileEventSetImage implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event set image';
  readonly type: string = AgencyProfileEventSetImage.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    imageDocument: DocumentModel;
  }) {

  }
}
