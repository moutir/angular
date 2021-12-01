import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class SuggestionEventRemove implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event remove';
  readonly type: string = SuggestionEventRemove.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    id: string;
  }) {

  }
}
