import { ActionEventInterface } from '../../action-event.interface';
import { FEATURE_NAME } from '../state';
import { ModelAbstract } from '../../../shared/class/model.abstract';

export class DocumentEventChangeList implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event change list';
  readonly type: string = DocumentEventChangeList.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    model: ModelAbstract;
  }) {

  }
}
