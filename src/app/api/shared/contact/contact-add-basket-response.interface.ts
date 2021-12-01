export interface ContactAddBasketResponseInterface {
  success: boolean;
  data: {
    count: number; // number of added contacts
    message: string; // confirmation message TODO[BE] can be removed from API
  };
}
