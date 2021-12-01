export interface ContractLoadResponseInterface {
  id: string;
  reference: string;
  currency: string;
  comment: string;
  asking_price: number;
  negotiated_price: number;
  negotiated_price_percentage: number;
  deposit_amount: number;
  deposit_amount_percentage: number;
  agency_fee: number;
  agency_fee_percentage: number;
  agency_fee_vat_excluded: number;
  agency_vat: number;
  is_active_price_percentage: boolean;
  is_active_fee_percentage: boolean;
  fund_amount_personal: number;
  fund_amount_mortgage: number;
  signature_date: string;
  project_date: string;
  offer_date: string;
  agreement_date: string;
  cooling_off_end_date: string;
  condition_precedent_date: string;
  schedule_date: string;
  contract_date: string;
  collection_date: string;
  bill_date: string;
  fund_accept_date: string;
  fund_condition_precedent_date: string;
  property_id: string;
  agency: {
    id: string;
    name: string;
  };
  sell_type: {
    id: string;
    label: string;
  };
  step: {
    id: string;
    name: string;
  };
  contacts: Array<{
    id: string;
    contact_id: string;
    contact_fullname: string;
    type_id: string;
    comment: string;
  }>;
  commissions: Array<{
    id: string;
    type_id: string;
    amount: number;
    comment: string;
    invoice: string;
    contact: {
      id: string;
      full_name: string;
    };
    commission_id: string;
  }>;
  create_contact: {
    id: string;
    firstname: string;
    lastname: string;
    initials: string;
  };
  create_datetime: string;
  update_contact: {
    id: string;
    firstname: string;
    lastname: string;
    initials: string;
  };
  update_datetime: string;
}
