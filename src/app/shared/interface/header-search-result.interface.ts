import { PropertyModel } from '../model/property.model';
import { PromotionModel } from '../model/promotion.model';
import { ContactModel } from '../model/contact.model';

export interface HeaderSearchResultInterface {
  contact: ContactModel[];
  property: PropertyModel[];
  promotion: PromotionModel[];
}
