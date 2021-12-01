import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeFeatureContactInterface } from '../../../shared/interface/runtime-feature-contact.interface';

export class RuntimeUpdateFeatureContact implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update feature contact';
  readonly type: string = RuntimeUpdateFeatureContact.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    featureContact: RuntimeFeatureContactInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      featureContact: {
        ...this.payload.featureContact,
      },
    };
  }
}
