import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeFeaturePromotionInterface } from '../../../shared/interface/runtime-feature-promotion.interface';

export class RuntimeUpdateFeaturePromotion implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update feature promotion';
  readonly type: string = RuntimeUpdateFeaturePromotion.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    featurePromotion: RuntimeFeaturePromotionInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      featurePromotion: {
        ...this.payload.featurePromotion,
      },
    };
  }
}
