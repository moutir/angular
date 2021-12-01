import { ModelAbstract } from '../shared/class/model.abstract';
import { Dictionary } from '../shared/class/dictionary';

export interface DataStateInterface<Model extends ModelAbstract> {
  models: Dictionary<Model>;
}
