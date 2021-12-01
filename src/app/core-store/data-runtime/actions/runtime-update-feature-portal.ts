import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeFeaturePortalInterface } from '../../../shared/interface/runtime-feature-portal.interface';
import { PortalEnum } from '../../../shared/enum/portal.enum';

export class RuntimeUpdateFeaturePortal implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update feature portal';
  readonly type: string = RuntimeUpdateFeaturePortal.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    featurePortal: RuntimeFeaturePortalInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      featurePortal: {
        ...this.payload.featurePortal,
        agencyWebsiteGatewayIds: this.payload.featurePortal.agencyWebsiteGatewayIds.map(id => <PortalEnum>String(id)),
      },
    };
  }
}
