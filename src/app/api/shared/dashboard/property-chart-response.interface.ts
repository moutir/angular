export interface PropertyChartResponseInterface {
  buyers: {
    mandates_to_be_renewed: number;
    owners_five_30: number;
    days_on_market_average: number;
  };
  chart: Array<{
    amount: number;
    y: number;
    stars: number;
  }>;
  graph: Array<{
    name: string;
    value: number;
  }>;
}
