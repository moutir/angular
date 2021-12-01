import { ModelAbstract } from '../class/model.abstract';
import { FormArrayModelInterface } from '../interface/form-array-model.interface';

export class ContactAddressModel extends ModelAbstract implements FormArrayModelInterface {
  id: string = '';
  line1: string = '';
  line2: string = '';
  line3: string = '';
  zipCode: string = '';
  city: string = '';
  countryId: string = '';
  countryLabel: string = '';
  notes: string = '';
  isMainAddress: boolean = false;

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
