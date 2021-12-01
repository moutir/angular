import { MatchingGroupListContactResponseInterface } from './matching-group-list-contact-response.interface';
import { MatchingGroupListPropertyResponseInterface } from './matching-group-list-property-response.interface';
import { MatchingGroupListPromotionResponseInterface } from './matching-group-list-promotion-response.interface';

export interface MatchingGroupListResponseInterface {
  data: Array<
    MatchingGroupListContactResponseInterface|MatchingGroupListPropertyResponseInterface|MatchingGroupListPromotionResponseInterface
  >;
  recordsTotal: string; // Total number of records matching search query

  // Useless attributes
  draw: string;
  myAgencyHasPartnership: boolean;
  recordsFiltered: string;
  profile: object;
}
