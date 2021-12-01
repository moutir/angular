import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class LayoutEventToggleSearch implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event toggle search';
  readonly type: string = LayoutEventToggleSearch.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    isActive: boolean;
  }) {

  }
}
