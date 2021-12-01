import { FEATURE_NAME, UiLeadStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { LeadModifyStatusInterface } from '../../../shared/interface/lead-modify-status.interface';

export class LeadUpdateModifyStatus implements ActionUpdateInterface<UiLeadStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update modify status';
  readonly type: string = LeadUpdateModifyStatus.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    modifyStatus: LeadModifyStatusInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiLeadStateInterface): UiLeadStateInterface {

    return {
      ...state,
      modifyStatus: {
        ...this.payload.modifyStatus,
      },
    };
  }
}
