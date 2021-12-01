import { ModelAbstract } from '../class/model.abstract';
import { AgencyModel } from './agency.model';
import { MarketingExpensePromotionModel } from './marketing-expense-promotion.model';
import { MarketingExpensePropertyModel } from './marketing-expense-property.model';
import { KeyValueType } from '../type/key-value.type';
import { CostPerLeadInterface } from '../interface/cost-per-lead.interface';

export class MarketingExpenseModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'agency',
    'properties',
    'promotions',
  ];

  /**
   * ID
   */
  id: string = '';

  /**
   * Title
   */
  title: string = '';

  /**
   * Invoice amount
   */
  invoiceAmount: number|null = null;

  /**
   * Invoice number
   */
  invoiceNumber: string = '';

  /**
   * Category ID
   */
  mainCategoryId: string = '';

  /**
   * Category label
   */
  mainCategoryLabel: string = '';

  /**
   * Sub category ID
   */
  subCategoryId: string = '';

  /**
   * Sub category label
   */
  subCategoryLabel: string = '';

  /**
   * Agency
   */
  agency: AgencyModel = new AgencyModel();

  /**
   * Properties
   */
  properties: MarketingExpensePropertyModel[] = [];

  /**
   * Promotions
   */
  promotions: MarketingExpensePromotionModel[] = [];

  /**
   * Invoice date
   */
  invoiceDate: Date = new Date();

  /**
   * Start date
   */
  startDate: Date = new Date();

  /**
   * End date
   */
  endDate: Date = new Date();

  /**
   * Cost per lead
   */
  costPerLead: {
    total: CostPerLeadInterface;
    property: KeyValueType<string, CostPerLeadInterface>;
    promotion: KeyValueType<string, CostPerLeadInterface>;
  } = {
    total: {
      leadCount: 0,
      totalCost: 0,
      averageCost: 0,
    },
    property: {},
    promotion: {},
  };
}
