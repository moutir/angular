import { ModelAbstract } from '../class/model.abstract';
import { FormArrayModelInterface } from '../interface/form-array-model.interface';

export class ContactEmailModel extends ModelAbstract implements FormArrayModelInterface {
  id: string = '';
  emailId: string = ''; // Ex: name@company.com
  notes: string = '';
  isMainEmail: boolean = false;
  isUsedMailing: boolean = false;
  isInvalid: boolean = false;

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
