import { FEATURE_NAME } from '../state';
import { SearchlistSearchInterface } from '../../../shared/interface/searchlist-search.interface';
import { ActionEventInterface } from '../../action-event.interface';

export class SearchlistEventSearch implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event search';
  readonly type: string = SearchlistEventSearch.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    search: SearchlistSearchInterface;
  }) {

  }
}
