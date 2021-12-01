import { MatchingListGroupsContactResponseInterface } from './matching-list-groups-contact-response.interface';
import { MatchingListGroupsPropertyResponseInterface } from './matching-list-groups-property-response.interface';
import { MatchingListGroupsPromotionResponseInterface } from './matching-list-groups-promotion-response.interface';

export interface MatchingListGroupsResponseInterface {
  data: Array<
    MatchingListGroupsContactResponseInterface|MatchingListGroupsPropertyResponseInterface|MatchingListGroupsPromotionResponseInterface
  >;
  recordsTotal: string; // Total number of records matching search query

  // Useless attributes
  draw: string;
  myAgencyHasPartnership: boolean;
  recordsFiltered: string;
  profile: object;
}
