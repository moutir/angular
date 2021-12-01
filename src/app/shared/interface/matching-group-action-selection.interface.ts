import { MatchingActionEnum } from '../enum/matching-action.enum';

export interface MatchingGroupActionSelectionInterface {
  matchingGroupId: string|null;
  matchingId: string|null;
  actionId: MatchingActionEnum;
  contactId: string|null;
  methodId: string|null;
  brokerId: string|null;
}
