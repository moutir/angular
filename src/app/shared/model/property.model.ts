import { ModelAbstract } from '../class/model.abstract';
import { AreaUnitEnum } from '../enum/area-unit.enum';
import { ContactModel } from './contact.model';
import { TypeEnum } from '../enum/type.enum';
import { LocationInterface } from '../interface/location.interface';
import { MortgageCalculationInterface } from '../interface/mortgage-calculation.interface';
import { AgencyModel } from './agency.model';

export class PropertyModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'broker',
    'owners',
    'intermediates',
    'agency',
  ];

  id: string = '';
  reference: string = '';
  createDate: Date|null = null;
  createContactId: string = '';
  updateDate: Date|null = null;
  updateContactId: string = '';
  link: string = '';
  rooms: string = '';
  bedrooms: string = '';
  bathrooms: string = '';
  areaLiving: string = '';
  areaLand: string = '';
  areaWeighted: string = '';
  isSharedRestricted: boolean = false;
  isMls: boolean = false;
  promotionId: string = '';
  photoSmallURL: string = '';
  photoLargeURL: string = '';
  currencyId: string = '';
  currencyLabel: string = '';
  ranking: number = 0;
  areaUnit: AreaUnitEnum = AreaUnitEnum.sqm;
  statusId: string = '';
  broker: ContactModel = new ContactModel();
  owners: ContactModel[] = [];
  intermediates: ContactModel[] = [];
  agency: AgencyModel = new AgencyModel();
  type: TypeEnum = TypeEnum.sell;
  notes: string = '';
  zip: string = '';
  agencyId: string = '';
  price: number = null;
  location: LocationInterface = {
    levels: [],
    label: '',
    street: '',
    zipcode: '',
  };
  mortgageCalculation: MortgageCalculationInterface|null = null;
  isAllowedPreview: boolean = true; // Is the property preview allowed ? // TODO[later] move this out of here
  priceFrequencyId: string = '';
  isPriceChargesIncluded: boolean|null = false;
  isArchived: boolean = false;

  // Labels already translated/formatted by BE, used only for display purpose
  labelStatus: string = '';
  labelCategory: string = '';
  labelSubcategory: string = '';
  labelPrice: string = '';
  labelMortgage: string = '';
  labelPriceCharges: string = '';

  // UI usage
  isLoading: boolean = false;
}
