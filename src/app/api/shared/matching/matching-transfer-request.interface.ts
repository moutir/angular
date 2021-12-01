export interface MatchingTransferRequestInterface extends Array<{
  match_ids: number[];
  broker_id: number;
  comment?: string;
}> {}
