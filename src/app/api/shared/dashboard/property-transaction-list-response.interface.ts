export interface PropertyTransactionListResponseInterface {
  data: Array<{
    address: string; // address
    agency_commission: number; // agency commission
    brokers: Array<{
      commission: string; // broker commission
      id: number; // broker id
      name: string; // broker name
      production: string; // broker production
    }>;
    buyer: Array<{
      id: number; // buyer id
      name: string; // buyer name
    }>;
    global_commission: number; // global commission
    intermediates: Array<{
      commission: number; // intermediate commission
      id: number; // intermediate id
      name: string; // intermediate name
      production: number; // intermediate production
    }>;
    net_commission: number; // agency net commission
    photo: string; // photo url
    property_archive: number; // archived property count
    property_id: number; // propety id
    property_invoice_number: number; // property invoice number
    reference: string; // property reference
    sale_date: string; // sale date
    sell_price: number; // sale price
    seller: Array<{
      id: number; // seller id
      name: string; // seller name
    }>;
    signature_date: string; // signature date
  }>;
  page: number; // current page
  per_page: number; // per page
  total_records: number; // total records
}
