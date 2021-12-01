import { ModelAbstract } from '../class/model.abstract';
import { ContactModel } from './contact.model';
import { AreaUnitEnum } from '../enum/area-unit.enum';
import { LocationInterface } from '../interface/location.interface';

export class PromotionModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'broker',
  ];

  id: string = '';
  name: string = '';
  reference: string = '';
  photoSmallURL: string = '';
  photoLargeURL: string = '';
  address1: string = '';
  address2: string = '';
  address3: string = '';
  link: string = '';
  areaUnit: AreaUnitEnum = AreaUnitEnum.sqm;
  isFromMyAgency: boolean = false;
  isBlacklisted: boolean = false;
  notes: string = '';
  propertyBedroomsFrom: number = 0;
  propertyBedroomsTo: number = 0;
  propertyAreaLivingFrom: number = 0;
  propertyAreaLivingTo: number = 0;
  propertyPrice: string = '';
  propertyPriceFrom: string = '';
  propertyPriceSold: string = '';
  propertyTotalCount: number = 0;
  propertySoldCount: number = 0;
  propertyReservedCount: number = 0;
  propertyAvailableCount: number = 0;
  propertyAreaWeightedFrom: number = 0;
  propertyAreaWeightedTo: number = 0;
  broker: ContactModel = new ContactModel();
  constructionStartDate: Date|null = null;
  constructionEndDate: Date|null = null;
  location: LocationInterface = {
    levels: [],
    label: '',
    street: '',
    zipcode: '',
  };
  isArchived: boolean = false;

  // UI usage
  isLoading: boolean = false;
}
