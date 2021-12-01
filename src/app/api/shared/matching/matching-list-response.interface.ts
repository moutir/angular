export interface MatchingListResponseInterface {
  data: Array<{
    id: string;
    comment: string;
    contact: {
      id: string;
    };
    contact_name: string;
    duration: string;
    index: number;
    photo: string;
    match_date: string;
    match_datetime: string;
    process_date: string;
    process_datetime: string;
    promotion_id: string;
    property: {
      id: string;
      transaction: string;
      archived: string;
      ranking: number;
      photoUrl: string;
    };
    property_reference: string;
    status_id: string;
    status: string;
  }>;
  draw: string;
  recordsFiltered: string;
  recordsTotal: string; // total number of records matching search query
}
