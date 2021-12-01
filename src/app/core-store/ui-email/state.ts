import { EmailSummaryInterface } from '../../shared/interface/email-summary.interface';

export const FEATURE_NAME = 'ui-email';

export interface UiEmailStateInterface {
  summary: EmailSummaryInterface;
}

export const initialState: UiEmailStateInterface = {
  summary: {
    step: 0,
    email: null,
  },
};
