import { LeadModifyStatusInterface } from '../../shared/interface/lead-modify-status.interface';

export const FEATURE_NAME = 'ui-lead';

export interface UiLeadStateInterface {

  // Contact validation active state
  isActiveValidation: boolean;

  // Lead modify status searchlist operation
  modifyStatus: LeadModifyStatusInterface;
}

export const initialState: UiLeadStateInterface = {
  isActiveValidation: false,
  modifyStatus: {
    statusId: '',
    leadIds: [],
  },
};
