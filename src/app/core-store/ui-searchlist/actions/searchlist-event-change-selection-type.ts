import { FEATURE_NAME } from '../state';
import { ListSelectionTypeEnum } from '../../../shared/enum/list-selection-type.enum';
import { ActionEventInterface } from '../../action-event.interface';

export class SearchlistEventChangeSelectionType implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event change selection type';
  readonly type: string = SearchlistEventChangeSelectionType.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    type: ListSelectionTypeEnum;
  }) {

  }
}
