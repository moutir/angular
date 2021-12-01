import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeFeatureRestrictionInterface } from '../../../shared/interface/runtime-feature-restriction.interface';

export class RuntimeUpdateFeatureRestriction implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update feature restriction';
  readonly type: string = RuntimeUpdateFeatureRestriction.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    featureRestriction: RuntimeFeatureRestrictionInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      featureRestriction: {
        ...this.payload.featureRestriction,
      },
    };
  }
}
