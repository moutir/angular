import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';

export class MarketingExpenseSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  dateFrom: Date|null = null;
  dateTo: Date|null = null;
  category: string|null = null;
  propertyId: string|null = null;
  promotionId: string|null = null;
}
