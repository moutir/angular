import { SearchOptionsInterface } from './search-options.interface';
import { OptionInterface } from './option.interface';

export interface DeviceSearchOptionsInterface extends SearchOptionsInterface {
  deviceType: OptionInterface[];
  userId: OptionInterface[];
}
