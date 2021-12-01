import { FEATURE_NAME, UiLeadStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class LeadUpdateIsActiveValidation implements ActionUpdateInterface<UiLeadStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update is active validation';
  readonly type: string = LeadUpdateIsActiveValidation.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    isActive: boolean;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiLeadStateInterface): UiLeadStateInterface {

    return {
      ...state,
      isActiveValidation: this.payload.isActive,
    };
  }
}
