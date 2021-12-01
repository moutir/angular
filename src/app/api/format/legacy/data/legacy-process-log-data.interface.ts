import { KeyValueType } from '../../../../shared/type/key-value.type';

export interface LegacyProcessLogDataInterface {
  id: string;
  status: string;
  uid: string;
  data: KeyValueType<string, string>;
}
