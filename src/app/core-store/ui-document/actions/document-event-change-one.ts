import { FEATURE_NAME } from '../state';
import { InputFormInterface } from '../../../shared/interface/input-form.interface';
import { ActionEventInterface } from '../../action-event.interface';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { DocumentModel } from '../../../shared/model/document.model';

export class DocumentEventChangeOne implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event change one';
  readonly type: string = DocumentEventChangeOne.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    model: ModelAbstract;
    document: DocumentModel;
    input: InputFormInterface;
  }) {

  }
}
