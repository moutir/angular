import { PositionInterface } from './position.interface';
import { MatchingGroupModel } from '../model/matching-group.model';
import { MatchingModel } from '../model/matching.model';

export interface MatchingGroupActionMenuInterface {
  position: PositionInterface;
  matchingGroup: MatchingGroupModel|null;
  matching: MatchingModel|null;
}
