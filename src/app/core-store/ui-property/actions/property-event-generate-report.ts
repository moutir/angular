import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class PropertyEventGenerateReport implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event generate report';
  readonly type: string = PropertyEventGenerateReport.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    propertyIds: string[];
  }) {

  }
}
