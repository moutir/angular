import { ActionEventInterface } from '../../action-event.interface';
import { FEATURE_NAME } from '../state';

export class AgencyProfileEventEmailPreview implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event email preview';
  readonly type: string = AgencyProfileEventEmailPreview.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {}) {

  }
}
