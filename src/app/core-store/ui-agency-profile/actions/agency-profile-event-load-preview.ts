import { ActionEventInterface } from '../../action-event.interface';
import { FEATURE_NAME } from '../state';

export class AgencyProfileEventLoadPreview implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event load preview';
  readonly type: string = AgencyProfileEventLoadPreview.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {}) {

  }
}
