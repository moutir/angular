import { AgencyEmailPreviewInterface } from '../../shared/interface/agency-email-preview.interface';

export const FEATURE_NAME = 'ui-agency-profile';

export interface UiAgencyProfileStateInterface {

  // Email preview
  emailPreview: AgencyEmailPreviewInterface;
}

export const initialState: UiAgencyProfileStateInterface = {
  emailPreview: {
    isOpen: false,
    data: {
      template: '',
      data: null,
    },
  },
};
