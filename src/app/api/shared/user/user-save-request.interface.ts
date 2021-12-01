export interface UserSaveRequestInterface {

  // Account
  account_id: string;
  account_login: string;
  account_pwd: string;
  account_pwd_confirm: string;
  account_user_profile: string;
  allow_switching: string;
  preferred_language: string;
  preferred_menu_display: string;
  preferred_home_page: string;
  enable_google_agenda: string;
  allow_send_on_behalf: string;

  // Profile
  contact_id: string;
  contact_title: string;
  contact_greeting: string;
  contact_language: string;
  contact_lastName: string;
  contact_firstName: string;
  mobile_visible: string;
  landLine_visible: string;
  email_visible: string;
  address_visible: string;
  contact_birthday: string;
  contact_nationality: string;
  contact_family_status: string;
  contact_children: string;
  zip_code: string;
  city: string;
  country: string;
  contact_company: string;
  contact_job: string;
  contact_banking_reference: string;
  mobile: string[];
  landLine: string[];
  email: string[];
  address: string[];
}
