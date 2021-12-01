import { ModelAbstract } from '../class/model.abstract';

export interface EventChangeSelectionModelInterface<Model extends ModelAbstract> {
  isSelected: boolean;
  model: Model;
}
