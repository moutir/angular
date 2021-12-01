import { Dictionary } from '../../../shared/class/dictionary';

export interface AgencyPreferenceSaveResponseInterface {

  // Legacy endpoints
  success?: boolean;
  data?: {
    messages: { [key: number]: string; };
  };

  // Updated endpoints
  validation?: null|Dictionary<string>;
}
