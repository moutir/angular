import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeFeaturePropertyInterface } from '../../../shared/interface/runtime-feature-property.interface';

export class RuntimeUpdateFeatureProperty implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update feature property';
  readonly type: string = RuntimeUpdateFeatureProperty.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    featureProperty: RuntimeFeaturePropertyInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      featureProperty: {
        ...this.payload.featureProperty,
      },
    };
  }
}
