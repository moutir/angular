export interface MyProductionTableResponseInterface extends
  Array<{
    data: Array<{
      name: number;
      val: number;
    }>;
    name: string;
    prefix?: string;
    type?: string;
  }> {

}
