import { ActionEventInterface } from '../../action-event.interface';
import { FEATURE_NAME } from '../state';
import { DocumentModel } from '../../../shared/model/document.model';

export class AgencyProfileEventChangedImage implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event changed image';
  readonly type: string = AgencyProfileEventChangedImage.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    imageDocument: DocumentModel;
  }) {

  }
}
