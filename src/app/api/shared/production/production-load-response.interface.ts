export interface ProductionLoadResponseInterface {
  colleagues: string;
  production: {
    [contactId: string]: {
      [year: string]: {
        [month: string]: {
          commission_rental: string;
          commission_sales: string;
          deals_rental: string;
          deals_sales: string;
          expenses_rental: string;
          expenses_sales: string;
          production_rental: string;
          production_sales: string;
          salary_rental: string;
          salary_sales: string;
          target_rental: string;
          target_sales: string;
        };
      };
    };
  };
}
