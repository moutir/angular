import { KeyValueType } from '../../../../shared/type/key-value.type';

export interface LegacySaveResponseInterface {

  // Legacy endpoints
  success?: boolean;
  data?: {
    messages: { [key: number]: string; };
  };

  // Updated endpoints
  validation?: null|KeyValueType<string, string>;
}
