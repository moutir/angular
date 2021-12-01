export interface UserLoadResponseInterface {
  profile: {
    id: string;
    reference: string;
    title: string;
    greeting: string;
    firstname: string;
    lastname: string;
    photo_id: string;
    photo_url: string;
    language: string;
    birth_date: string;
    main_mobile: string;
    main_landline: string;
    main_email: string;
    main_address: string;
    zip_code: string;
    city: string;
    country_id: string;
    create_datetime: string;
    update_datetime: string;
    nationality: string;
    marital_status: string;
    children: string;
    company: string;
    profession: string;
    bank_reference: string;
    mobiles: Array<{
      number: string;
      is_main_number: boolean;
      notes: string;
    }>;
    landlines: Array<{
      number: string;
      is_main_number: boolean;
      notes: string;
    }>;
    emails: Array<{
      email: string;
      is_main_email: boolean;
      notes: string;
      is_used_mailing: boolean;
    }>;
    addresses: Array<{
      line1: string;
      line2: string;
      line3: string;
      zip_code: string;
      city: string;
      country_id: string;
      notes: string;
      is_main_address: boolean;
    }>;
    social_media_links: {
      linkedin: string;
      instagram: string;
      facebook: string;
      twitter: string;
    };
    create_contact: {
      id: string;
      initials: string;
      firstname: string;
      lastname: string;
    };
    update_contact: {
      id: string;
      initials: string;
      firstname: string;
      lastname: string;
    };
  };
  account: {
    id: string;
    login: string;
    password: string;
    password_confirm: string;
    expiry_date: string;
    user_profile: string;
    type: string;
    is_allowed_switching: string;
    preferred_language: string;
    preferred_menu_layout: string;
    preferred_menu_display: string;
    preferred_home_page: string;
    is_enabled_google_agenda: string;
    allow_send_on_behalf: string;
  };
}
