import { ModelAbstract } from '../class/model.abstract';
import { FormArrayModelInterface } from '../interface/form-array-model.interface';
import { PropertyModel } from './property.model';

export class MarketingExpensePropertyModel extends ModelAbstract implements FormArrayModelInterface {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'property',
  ];

  id: string = '';
  property: PropertyModel = new PropertyModel();
  amount: number|null = null;
  title: string = '';

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
