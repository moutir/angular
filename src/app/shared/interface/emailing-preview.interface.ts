import { KeyValueType } from '../type/key-value.type';
import { EmailingPreviewDataInterface } from './emailing-preview-data.interface';

export class EmailingPreviewInterface {
  isOpen: boolean;
  data: KeyValueType<string, EmailingPreviewDataInterface>;
}
