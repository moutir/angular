import { SearchOptionsInterface } from './search-options.interface';

export interface PortalSearchOptionsInterface extends SearchOptionsInterface {
  csrf?: string; // CSRF token
}
