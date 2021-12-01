import { AgencyPreferenceChoiceInterface } from './agency-preference-choice.interface';

export interface RuntimeAgencyPreferenceOptionInterface {
  name: string;
  label: string;
  preferences: Array<{
    id: string;
    name: string;
    label: string;
    inputType: string;
    defaultValue: string;
    availableOptions: AgencyPreferenceChoiceInterface[];
  }>;
}
