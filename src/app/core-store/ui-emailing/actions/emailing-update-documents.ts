import { FEATURE_NAME, UiEmailingStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { DocumentModel } from '../../../shared/model/document.model';
import { Dictionary } from '../../../shared/class/dictionary';

export class EmailingUpdateDocuments implements ActionUpdateInterface<UiEmailingStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update documents';
  readonly type: string = EmailingUpdateDocuments.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    documents: KeyValueType<EntityEnum, Dictionary<DocumentModel[]>>;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiEmailingStateInterface): UiEmailingStateInterface {

    return {
      ...state,
      documents: {
        ...this.payload.documents,
      },
    };
  }
}
