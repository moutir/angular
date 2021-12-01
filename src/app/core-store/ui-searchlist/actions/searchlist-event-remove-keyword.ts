import { FEATURE_NAME } from '../state';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { ActionEventInterface } from '../../action-event.interface';

export class SearchlistEventRemoveKeyword implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event remove keyword';
  readonly type: string = SearchlistEventRemoveKeyword.TYPE;

  /**
   * Constructor
   */
  constructor(
    public payload: {
      uid: string,
      keyword: KeywordInterface,
    },
  ) {

  }
}
