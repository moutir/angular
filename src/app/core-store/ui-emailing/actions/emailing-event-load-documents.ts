import { ActionEventInterface } from '../../action-event.interface';
import { FEATURE_NAME } from '../state';

export class EmailingEventLoadDocuments implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event load documents';
  readonly type: string = EmailingEventLoadDocuments.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    agencyId: string;
    contactIds: string[];
    propertyIds: string[];
    promotionIds: string[];
  }) {

  }
}
