import { SearchlistSearchInterface } from './searchlist-search.interface';
import { KeyValueType } from '../type/key-value.type';

export interface RuntimeUserPreferenceInterface {
  searchlist: KeyValueType<string, SearchlistSearchInterface>;
  beta: KeyValueType<string, boolean>;
}
