import { FEATURE_NAME } from '../state';
import { AutocompleteSearchInterface } from '../../../shared/interface/autocomplete-search.interface';
import { ActionEventInterface } from '../../action-event.interface';

export class AutocompleteEventSearch implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event search';
  readonly type: string = AutocompleteEventSearch.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    search: AutocompleteSearchInterface;
  }) {

  }
}
