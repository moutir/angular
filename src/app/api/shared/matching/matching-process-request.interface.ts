export interface MatchingProcessRequestInterface extends Array<{
  match_ids: number[];
  date: string;
  method_id: number;
  comment: string;
}> {}
