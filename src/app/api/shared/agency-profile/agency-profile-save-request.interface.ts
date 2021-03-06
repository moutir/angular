export interface AgencyProfileSaveRequestInterface {
  agency_id: string;
  agency_name: string;
  agency_profile: string;
  foundation_year: string;
  founder: string;
  director: string;
  ceo: string;
  administrator: string;
  nb_employees: string;
  mobile_visible: string;
  landLine_visible: string;
  fax: string;
  email_visible: string;
  mobile: string[];
  landLine: string[];
  email: string[];
  address_visible: string;
  address: string[];
  zip_code: string;
  city: string;
  country: string;
  id_select_template: string;
  background_color_head_foot: string;
  background_color_main: string;
  background_color_message: string;
  background_color_property_title: string;
  text_color_head_foot: string;
  text_color_main: string;
  text_color_message: string;
  text_color_property_title: string;
  watermark_transparency: number;
  watermark_on_brochure: string;
  watermark_on_website: string;
  watermark_on_gateway: string;
}
