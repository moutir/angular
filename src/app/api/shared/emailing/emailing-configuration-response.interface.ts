export interface EmailingConfigurationResponseInterface {
  subject: string;
  message: string;
  in_reply_to: string;
  lead_ids: string[];
  recipients: Array<{
    agency_id: string;
    contact_id: string;
    email: string;
    firstname: string;
    language_id: string;
    lastname: string;
    search: string;
    type: string;
  }>;
  manage_lead_by_email: boolean;
}
