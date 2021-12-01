
export interface PortalAgencyDetailsResponseInterface {
  success: boolean;
  gateway: {
    gateway_agency_name: string;
    gateway_agency_phone_sales: string;
    gateway_agency_phone_rentals: string;
    gateway_agency_email_sales: string;
    gateway_agency_email_rentals: string;
    gateway_agency_street: string;
    gateway_agency_zip: string;
    gateway_agency_city: string;
    gateway_agency_country: string;
  };
}
