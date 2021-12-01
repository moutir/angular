export interface LeadSaveRequestInterface {
  lead_id: string;
  lead_contact_need_validation: string;
  lead_date: string;
  contact: string;
  lead_contact_value: string;
  property: string[];
  lead_property_value: string[];
  lead_promotion_value: string[];
  lead_managed_by: string;
  main_lead_source: string;
  sub_lead_source: string;
  lead_type: string;
  lead_original_communication_mean: string;
  lead_status: string;
  message: string;
  lead_management_date: string;
  lead_management_communication_mean: string;
  notes: string;
}
