import { FEATURE_NAME } from '../state';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { ActionEventInterface } from '../../action-event.interface';

export class SearchlistEventContextMenu implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event context menu';
  readonly type: string = SearchlistEventContextMenu.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    model: ModelAbstract;
  }) {

  }
}
