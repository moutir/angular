import { OptionGroupInterface } from './option-group.interface';
import { Dictionary } from '../class/dictionary';

export interface EntityDocumentsOptionsInterface {

  // List of agency documents
  agency: OptionGroupInterface[];

  // List of documents per contact
  contact: Dictionary<OptionGroupInterface>;

  // List of documents per property
  property: Dictionary<OptionGroupInterface>;

  // List of documents per promotion
  promotion: Dictionary<OptionGroupInterface>;
}
