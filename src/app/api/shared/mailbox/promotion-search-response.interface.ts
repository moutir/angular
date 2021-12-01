export interface PromotionSearchResponseInterface {
  query: string;
  suggestions: Array<{
    data: string;
    name: string;
    value: string;
  }>;
}
