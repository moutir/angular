export interface MlsAgencyProfileResponseInterface {
  agency_id: string;
  agency_is_active: string;
  agency_administrator: string;
  agency_branches: string;
  agency_ceo: string;
  agency_cities: string;
  agency_city: string;
  agency_color_logo_bckgrd: string;
  agency_contacts1: Array<{
    phone: string;
    email: string;
    firstname: string;
    lastname: string;
    position: string;
    avatar: string;
  }>;
  agency_contacts2: Array<{
    phone: string;
    email: string;
    firstname: string;
    lastname: string;
    position: string;
    avatar: string;
  }>;
  agency_director: string;
  agency_email: string;
  agency_employee: string;
  agency_foundation_year: string;
  agency_founder: string;
  agency_headquarter: string;
  agency_line1: string;
  agency_line2: string;
  agency_line3: string;
  agency_linkedin: string;
  agency_logo: string;
  agency_name: string;
  agency_phone: string;
  agency_profile: string;
  agency_zip: string;
  rental_listings: string;
  rental_searches: string;
  sales_listings: string;
  sales_searches: string;
  show_invitation_button: boolean;
  show_statistics: boolean;
  social_media_links: {
    website: string;
    linkedin: string;
    instagram: string;
    facebook: string;
    twitter: string;
  };
}
