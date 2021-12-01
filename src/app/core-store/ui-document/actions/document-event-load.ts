import { ActionEventInterface } from '../../action-event.interface';
import { FEATURE_NAME } from '../state';
import { ModelAbstract } from '../../../shared/class/model.abstract';

export class DocumentEventLoad implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event load';
  readonly type: string = DocumentEventLoad.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    model: ModelAbstract,
  }) {

  }
}
