export interface MortgageCalculationInterface {
  loanValue: number;
  loanPercentage: number;
  personalContribution: number;
  amortization: number;
  amortizationPeriod: string;
  yearInterest5: number;
  yearInterest10: number;
  yearInterest15: number;
  yearInterestPercentage5: number;
  yearInterestPercentage10: number;
  yearInterestPercentage15: number;
  yearInterestPeriod: string;
  currency: string;
}
