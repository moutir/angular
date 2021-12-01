import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeContactTypeByGroupInterface } from '../../../shared/interface/runtime-contact-type-by-group.interface';

export class RuntimeUpdateContactTypeByGroup implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update contact type by group';
  readonly type: string = RuntimeUpdateContactTypeByGroup.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    contactTypeByGroup: RuntimeContactTypeByGroupInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      contactTypeByGroup: {
        ...this.payload.contactTypeByGroup,
      },
    };
  }
}
