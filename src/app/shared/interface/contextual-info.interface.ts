import { ContextualInfoOptionsInterface } from './contextual-info-options.interface';
import { PositionInterface } from './position.interface';

export interface ContextualInfoInterface {
  type: string;
  isOpen: boolean;
  options?: ContextualInfoOptionsInterface;
  message?: string;
  position: PositionInterface;
  isLoading?: boolean;
}
