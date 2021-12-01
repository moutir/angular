import { AgencyPreferenceChoiceInterface } from './agency-preference-choice.interface';

export interface AgencyPreferenceContentInterface {
  pages: Array<{
    label: string;
    preferences: Array<{
      label: string;
      description: string;
      control: string;
      options: AgencyPreferenceChoiceInterface[];
    }>;
  }>;
}
