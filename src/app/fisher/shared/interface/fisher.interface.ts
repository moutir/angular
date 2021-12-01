import { FisherAddressInterface } from './fisher-address.interface';
import { FisherLocationInterface } from './fisher-location.interface';
import { FisherPropertyInterface } from './fisher-property.interface';
import { FisherContactInterface } from './fisher-contact.interface';

export interface FisherInterface {
  step: number;
  addressInfo: FisherAddressInterface;
  locationInfo: FisherLocationInterface;
  propertyInfo: FisherPropertyInterface;
  contactInfo: FisherContactInterface;
}
