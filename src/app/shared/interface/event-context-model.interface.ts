import { ModelAbstract } from '../class/model.abstract';
import { PositionInterface } from './position.interface';

export interface EventContextModelInterface<Model extends ModelAbstract> {
  position: PositionInterface;
  model: Model;
}
