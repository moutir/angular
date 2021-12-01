import { Params } from '@angular/router';

import { ActionEventInterface } from '../../action-event.interface';
import { FEATURE_NAME } from '../state';

export class TaskEventEntitiesFromRoute implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event entities from route';
  readonly type: string = TaskEventEntitiesFromRoute.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    queryParams: Params;
  }) {

  }
}
