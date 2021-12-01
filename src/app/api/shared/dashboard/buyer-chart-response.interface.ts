export interface BuyerChartResponseInterface {
  buyers: {
    buyers_five_10: number; // not contacted for > 10 days
    buyers_five_15: number; // not contacted for > 15 days
    buyers_five_30: number; // not contacted for > 30 days
    buyers_five_60: number; // not contacted for > 60 days
  };
  chart: Array<{
    amount: number; // amount
    y: number;
    stars: number; // stars
  }>;
}
