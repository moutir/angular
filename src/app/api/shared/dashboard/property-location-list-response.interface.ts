export interface PropertyLocationListResponseInterface extends Array<{
  name: string; // location
  data: {
    portfolio: number; // portfolio count
    leads: number; // lead count
  };
}> {

}
