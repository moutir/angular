export interface ReportScheduleRequestInterface extends Array<{
  type: string;
  property_id: string;
  contact_id: string;
  lang: string;
  from: string;
  to: string;
  schedule_frequency: string;
  date_range: string;
  schedule_start: string;
  schedule_end: string;
  clone_for_other_owners: string;
  enable_schedule: string;
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
}> {

}
