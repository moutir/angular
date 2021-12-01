import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeFeaturePriceInterface } from '../../../shared/interface/runtime-feature-price.interface';

export class RuntimeUpdateFeaturePrice implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update feature price';
  readonly type: string = RuntimeUpdateFeaturePrice.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    featurePrice: RuntimeFeaturePriceInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      featurePrice: {
        ...this.payload.featurePrice,
      },
    };
  }
}
