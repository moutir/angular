export interface ReportLoadConfigurationResponseInterface {
  success: boolean;
  configuration: {
    informations: string;
    broker: string;
    price: string;
    leads: string;
    time: string;
    sending: string;
    past_visits: string;
    next_visits: string;
    marketing_expenses: string;
    summary: string;
    offers: string;
    communications: string;
    frequency: string;
    date_range: string;
  };
}
