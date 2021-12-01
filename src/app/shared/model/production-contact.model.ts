import { ModelAbstract } from '../class/model.abstract';
import { ContactModel } from './contact.model';
import { FormArrayModelInterface } from '../interface/form-array-model.interface';

export class ProductionContactModel extends ModelAbstract implements FormArrayModelInterface {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'contact',
  ];

  id: string = '';
  contact: ContactModel = new ContactModel();
  commissionRental: string = '';
  commissionSales: string = '';
  dealRental: string = '';
  dealSales: string = '';
  expenseRental: string = '';
  expenseSales: string = '';
  productionRental: string = '';
  productionSales: string = '';
  salaryRental: string = '';
  salarySales: string = '';
  targetRental: string = '';
  targetSales: string = '';

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
