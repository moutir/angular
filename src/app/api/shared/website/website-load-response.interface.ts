export interface WebsiteLoadResponseInterface {
  id: string;
  can_activate_fisher: boolean;
  activate_fisher: boolean;
  website_layout: string;
  is_internal: string; // string '0' or '1'
  url: string;
  alternative_domain: string;
  template: string;
  default_lang: string;
  lang_available: string[];
  facebook_appid: string;
  google_analytics_appid: string;
  selected_team_members: string[];
  active: string; // string '0' or '1'
  preview_url: string;
  server_ip_address: string;
  api_key: string;
  api_key_public: string;
  style: {
    site_background_colour: string;
    block_background_colour: string;
    primary_background_colour: string;
    primary_background_flat_colour: string;
    secondary_background_colour: string;
    footer_background_colour: string;
    primary_font_colour: string;
    secondary_font_colour: string;
    header_footer_font_colour: string;
    details_title_background_colour: string;
    details_title_background_shadow_colour: string
    details_amenities_font_colour: string;
    details_top_bar_colour: string;
  };
  home_page_content: Array<{
    language: string;
    title: string;
    content: string;
    seo_keyword: string;
    seo_description: string;
  }>;
}
