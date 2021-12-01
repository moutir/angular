export interface FisherValuationResponseInterface {
  contact_id: string;
  lead_id: string;
  valuation: {
    confidence: string;
    currency: string;
    valueRangeLower: number;
    valueRangeUpper: number;
  };
}
