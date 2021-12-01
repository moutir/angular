export interface MortgageCalculationResponseInterface {
  data: {
    interest_rate: {
      min_interest_5: number;
      min_interest_10: number;
      min_interest_15: number;
    };
    monthly_total_interest_5: number;
    monthly_total_interest_10: number;
    monthly_total_interest_15: number;
    borrow_ratio: number;
    loan_value: number;
    monthly_amortization: number;
    own_founds: number;
    update_at: string;
    currency: string;
  };
  errors: [];
}
