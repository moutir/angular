export interface MarketingExpenseListResponseInterface {
    data: Array<{
        agency_id: string;
        amount: string;
        id: string;
        invoice_date: string;
        invoice_number: string;
        main_category: string;
        main_category_id: string;
        period_end: string;
        period_start: string;
        sub_category: string;
        sub_category_id: string;
        title: string;
    }>;
    draw: string;
    recordsTotal: string;
    recordsFiltered: string;
}
