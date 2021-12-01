export interface MarketingExpenseLoadResponseInterface {
  id: string;
  agency_id: string;
  amount: string;
  invoice_date: string;
  invoice_number: string;
  main_category_id: string;
  period_end: string;
  period_start: string;
  promotions: Array<{
    amount: string;
    city: string;
    label: string;
    line1: string;
    line2: string;
    line3: string;
    name: string;
    promotion_id: string;
    reference: string;
    title: string;
    lead_count: string;
  }>;
  properties: Array<{
    amount: string;
    city: string;
    label: string;
    line1: string;
    line2: string;
    line3: string;
    property_id: string;
    reference: string;
    title: string;
    lead_count: string;
  }>;
  readonly: boolean;
  sub_category_id: string;
  success: boolean;
  title: string;
  lead_count: string;
}
