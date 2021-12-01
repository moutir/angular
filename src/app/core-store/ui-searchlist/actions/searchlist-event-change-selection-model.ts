import { FEATURE_NAME } from '../state';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { ActionEventInterface } from '../../action-event.interface';

export class SearchlistEventChangeSelectionModel implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event change selection model';
  readonly type: string = SearchlistEventChangeSelectionModel.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    isSelected: boolean;
    model: ModelAbstract;
  }) {

  }
}
