import { Dictionary } from '../../shared/class/dictionary';

import { HeaderSearchEntityInterface } from './header-search-entity.interface';

export interface HeaderSearchInterface {
  query: string;
  isActive: boolean;
  entities: Dictionary<HeaderSearchEntityInterface>;
}
