export interface WebsiteSaveRequestInterface {
  is_internal: string;
  website_layout: string;
  template: string;
  default_lang: string;
  lang_available: string[];
  url: string;
  alternative_domain: string;
  facebook_appid: string;
  google_analytics_appid: string;
  activate_fisher: string;
  active: string;
  agency_website_team: string[];
  site_background_colour: string;
  primary_background_colour: string;
  primary_background_flat_colour: string;
  secondary_background_colour: string;
  block_background_colour: string;
  footer_background_colour: string;
  primary_font_colour: string;
  secondary_font_colour: string;
  header_footer_font_colour: string;
  details_title_background_colour: string;
  details_title_background_shadow_colour: string;
  details_amenities_font_colour: string;
  details_top_bar_colour: string;
  home_page_contents: string;
}
