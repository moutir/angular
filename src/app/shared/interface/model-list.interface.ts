import { ModelAbstract } from '../class/model.abstract';

export interface ModelListInterface<Model extends ModelAbstract> {
  models: Model[];
  total: number|null;
}
