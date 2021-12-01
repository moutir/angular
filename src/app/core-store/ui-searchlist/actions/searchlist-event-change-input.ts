import { FEATURE_NAME } from '../state';
import { InputFormInterface } from '../../../shared/interface/input-form.interface';
import { ActionEventInterface } from '../../action-event.interface';
import { ListFiltersInterface } from '../../../shared/interface/list-filters.interface';

export class SearchlistEventChangeInput implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event change input';
  readonly type: string = SearchlistEventChangeInput.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    input: InputFormInterface;
    model: ListFiltersInterface;
  }) {

  }
}
