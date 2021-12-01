export interface PropertyAddBasketResponseInterface {
  success: boolean;
  data: {
    count: number; // number of added properties
    message: string; // confirmation message TODO[BE] can be removed from API
  };
}
