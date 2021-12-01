import { ModelAbstract } from '../class/model.abstract';
import { ContactModel } from './contact.model';
import { FormArrayModelInterface } from '../interface/form-array-model.interface';

export class ContractCommissionModel extends ModelAbstract implements FormArrayModelInterface {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'contact',
  ];

  // Attributes
  id: string = '';
  typeId: string = '';
  typeLabel: string = '';
  comment: string = '';
  invoice: string = '';
  amount: number = 0;
  contact: ContactModel = new ContactModel();
  parentContractCommissionId: string = '';
  contractId: string = '';

  // UI usage
  isNew: boolean = true;
  isRemoved: boolean = false;

  /**
   * @inheritDoc
   */
  getOrder(): string {

    return [
      (this.parentContractCommissionId || this.id || '0').padStart(10, '0'),
      (this.id || '0').padStart(10, '0'),
    ].join(',');
  }
}
