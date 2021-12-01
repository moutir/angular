import { ActionEventInterface } from '../../action-event.interface';
import { Params } from '@angular/router';

import { FEATURE_NAME } from '../state';

export class EmailingEventLoadConfiguration implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event load configuration';
  readonly type: string = EmailingEventLoadConfiguration.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    queryParams: Params;
  }) {

  }
}
