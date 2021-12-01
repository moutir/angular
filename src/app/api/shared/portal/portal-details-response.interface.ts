
export interface PortalDetailsResponseInterface {
  success: boolean;
  agency_gateway: {
    values: {
      agency_gateway_id: string;
      agency_website_id: string|null;
      gateway: string;
      gateway_with_credentials: boolean;
      label: string;
      gateway_type: string;
      sender: string;
      is_active_gateway: number;
      last_status: string;
      language: string;
      max_pictures: string;
      gateway_default_max_pictures: string;
      image_to_be_transferred: number;
      publication: string;
      gateway_agency_id: string;
      gateway_agency_name: string;
      gateway_agency_reference: string;
      gateway_agency_phone_sales: string;
      gateway_agency_phone_rentals: string;
      gateway_agency_email_sales: string;
      gateway_agency_email_rentals: string;
      gateway_agency_fax: string;
      gateway_agency_street: string;
      gateway_agency_zip: string;
      gateway_agency_city: string;
      gateway_agency_country: string;
      ftp_login: string;
      ftp_password: string;
      ftp_host: string;
      ftp_port: string;
      ftp_timeout: string;
      ftp_attempts: string;
      ftp_pasv: string;
      ftp_data_folder: string;
      ftp_images_folder: string;
      ftp_movies_folder: string;
      ftp_docs_folder: string;
      is_active_ftp: number; // boolean 0 | 1
      is_marketing_gateway: number;
      marketing_price: string;
      marketing_monthly: string;
      send_empty_file: number; // boolean 0 | 1
      send_broker_phone: number; // boolean 0 | 1
      top_listing: number;
      send_lead_copy: number;
      send_lead_copy_sales: number;
      send_lead_copy_rentals: number;
    },
  };
}
