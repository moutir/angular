export interface ValuationResponseInterface {
  data: {
    url: string;
    confidence: string;
    priceLower: number;
    priceUpper: number;
    currency: string;
  };
  errors: [];
}
