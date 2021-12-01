export interface EmailListResponseInterface {
  data: Array<{
    id: string;
    firstname: string;
    lastname: string;
    message: string;
    sender_id: string;
    sent_date: string;
    sent_datetime: string;
    subject: string;
    real_sender_firstname: string;
    real_sender_id: string;
    real_sender_lastname: string;
    statistics: {
      attachments: Array<{
        filename: string;
        url: string;
      }>;
      emailingId: string;
      nb_attachments: number;
      nb_bounces: number;
      nb_brochures: number;
      nb_emails: number;
      nb_open: number;
      nb_promotions: number;
      nb_properties: number;
      nb_recipients: number;
      promotions: Array<{
        address: string;
        id: string;
        link: string;
        location: string[];
        name: string;
        photo_thumb: string;
        photo_zoom: string;
        reference: string;
        summary: {
          bathrooms_from: string;
          bathrooms_to: string;
          bedrooms_from: string;
          bedrooms_to: string;
          currency_id: string;
          habitable_from: string;
          habitable_to: string;
          num_of_properties: number;
          price: number;
          price_from: string;
          price_sold: number;
          price_to: string;
          reserved: number;
          rooms_from: string;
          rooms_to: string;
          sold: number;
          weighted_from: string;
          weighted_to: string;
        };
      }>;
      properties: Array<{
        address: string;
        id: string;
        link: string;
        location: string[];
        photo_thumb: string;
        photo_zoom: string;
        price: string;
        reference: string;
        ranking: string;
        rooms: string;
        bedrooms: string;
        habitable: string;
        land: string;
      }>;
      recipients: Array<{
        contact: {
          address: string;
          company: string;
          email: string;
          firstname: string;
          lastname: string;
          link: string;
          landline: string;
          mobile: string;
          photo: string;
        };
        downloaded_promotions: Array<{
          id: string;
          count: number;
          first_download_date: string;
          first_download_datetime: string;
          last_download_date: string;
          last_download_datetime: string;
        }>;
        downloaded_properties: Array<{
          id: string;
          count: number;
          first_download_date: string;
          first_download_datetime: string;
          last_download_date: string;
          last_download_datetime: string;
        }>;
        email_address: string;
        first_open_date: string;
        first_open_datetime: string;
        firstname: string;
        id: string;
        last_open_date: string;
        last_open_datetime: string;
        lastname: string;
        nb_downloads: number;
        nb_open: number;
        status: number;
        status_code: string;
        status_date: string;
        status_datetime: string;
        status_description: string;
      }>;
    };
  }>;
  draw: string;
  recordsFiltered: string;
  recordsTotal: string;
}
