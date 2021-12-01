import { ModelAbstract } from '../class/model.abstract';
import { KeyValueType } from '../type/key-value.type';

export class ProcessLogModel extends ModelAbstract {

  id: string = '';
  status: string = '';
  uid: string = '';
  data: KeyValueType<string, string>;
}
