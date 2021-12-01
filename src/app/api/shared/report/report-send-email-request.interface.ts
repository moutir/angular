export interface ReportSendEmailRequestInterface {
  type: string;
  lang: string;
  report_id: string;
  contact_id: string;
  email_exists: boolean;
  name: string;
  property: string;
  property_id: string;
  promotion_id: string;
  from: string;
  to: string;
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
  hide_intermediary_task: string;
}
