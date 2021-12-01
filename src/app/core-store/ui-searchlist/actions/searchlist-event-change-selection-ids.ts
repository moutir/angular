import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class SearchlistEventChangeSelectionIds implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': change selection IDs';
  readonly type: string = SearchlistEventChangeSelectionIds.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    ids: string[];
  }) {

  }
}
