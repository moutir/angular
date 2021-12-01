export interface ContractListResponseInterface {
  data: Array<{
    id: string;
    reference: string;
    agency: string;
    step: {
      id: string;
      name: string;
    };
    broker: {
      id: string;
      full_name: string;
    };
    seller: {
      id: string;
      full_name: string;
    };
    buyer: {
      id: string;
      full_name: string;
    };
    signed_price: string;
    property: string;
  }>;
  total: number;
}
