import { ModelAbstract } from '../class/model.abstract';
import { FormArrayModelInterface } from '../interface/form-array-model.interface';
import { PromotionModel } from './promotion.model';

export class MarketingExpensePromotionModel extends ModelAbstract implements FormArrayModelInterface {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'promotion',
  ];

  id: string = '';
  promotion: PromotionModel = new PromotionModel();
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
