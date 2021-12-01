export interface AgencyLoadResponseInterface {
  data: Array<{
    id: string;
    label: string;
    cost?: number;
    is_core_option: number;
    fixed_order: string;
    active: boolean;
    amount_paid: string;
  }>;
}
