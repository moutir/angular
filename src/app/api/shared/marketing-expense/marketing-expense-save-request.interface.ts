export interface MarketingExpenseSaveRequestInterface {
  marketing_id: string;
  invoice_date: string;
  marketing_main_category: string;
  marketing_sub_category: string;
  invoice_amount: number;
  invoice_title: string;
  invoice_number: string;
  period_start: string;
  period_end: string;
  marketing_property_labels?: string[];
  marketing_property_ids?: string[];
  marketing_property_amounts?: number[];
  marketing_property_titles?: string[];
  marketing_promotion_labels?: string[];
  marketing_promotion_ids?: string[];
  marketing_promotion_amounts?: number[];
  marketing_promotion_titles?: string[];
}
