import { ModelAbstract } from '../class/model.abstract';
import { PhoneTypeEnum } from '../enum/phone-type.enum';
import { FormArrayModelInterface } from '../interface/form-array-model.interface';

export class ContactPhoneModel extends ModelAbstract implements FormArrayModelInterface {
  id: string = '';
  number: string = '';
  notes: string = '';
  isMainNumber: boolean = false;
  type: PhoneTypeEnum = null;

  // UI usage
  isNew: boolean = false;
  isRemoved: boolean = false;

  /**
   * @inheritDoc
   */
  getOrder(): string {

    return [
      (this.isNew ? '1' : '0'),
      (this.id || '0').padStart(10, '0'),
    ].join(',');
  }
}
