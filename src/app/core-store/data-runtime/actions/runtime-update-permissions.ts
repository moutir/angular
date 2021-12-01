import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { PermissionEnum } from '../../../shared/enum/permission.enum';

export class RuntimeUpdatePermissions implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update permissions';
  readonly type: string = RuntimeUpdatePermissions.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    permissions: PermissionEnum[];
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      permissions: this.payload.permissions.slice(0),
    };
  }
}
