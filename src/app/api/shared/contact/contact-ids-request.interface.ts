import { ContactFiltersDecoratorInterface } from './contact-filters-decorator.interface';

export interface ContactIdsRequestInterface extends ContactFiltersDecoratorInterface {
  format: 'numeric';
}
