import { Dictionary } from '../class/dictionary';
import { ModelAbstract } from '../class/model.abstract';
import { ProductionContactModel } from './production-contact.model';
import { ProductionValueInterface } from '../interface/production-value.interface';

export class ProductionModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'contacts',
  ];

  id: string = '';
  contacts: ProductionContactModel[] = [];
  contactsByType: Dictionary<ProductionContactModel[]> = {};
  values: Dictionary<Dictionary<ProductionValueInterface>> = {};
  saleYearlyDate: Date|null = null;
  saleMonthlyDate: Date|null = null;
  rentalYearlyDate: Date|null = null;
  rentalMonthlyDate: Date|null = null;
}
