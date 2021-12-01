import { Params } from '@angular/router';

import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class SearchlistEventSubmitByRoute implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event submit by route';
  readonly type: string = SearchlistEventSubmitByRoute.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    queryParams: Params;
  }) {

  }
}
