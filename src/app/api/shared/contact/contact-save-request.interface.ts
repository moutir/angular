export interface ContactSaveRequestInterface {

  // Contact
  contact_id: string; // 1072504
  ranking: string; // 0
  contact_title: string; // 127
  contact_greeting: string; // 323
  contact_language: string; // en
  contact_visibility: string; // 132
  contact_pipeline_stage: string; // 2
  contact_lastName: string; // Favaron
  contact_firstName: string; // Nicolas
  contact_vip: string; // 1
  contact_lastName2: string; // 2nom
  contact_firstName2: string; // 2prenom
  contact_type: string[]; // 12
  contact_main_contact: string; // 59948
  contact_sale_contact: string; // 1590999
  contact_rental_contact: string; // 1015218
  mobile: string[]; // 123456|^|1|^|note|^|1
  landLine: string[]; // +41 79 504 1786|^|1|^|note4|^|1
  email: string[]; // nicolas@realforce.ch|^|1|^||^|1|^|
  contact_custom_attribute: string[]; // 6
  contact_linkedin: string; // linked
  contact_instagram: string; // insta
  contact_facebook: string; // face
  contact_twitter: string; // twit
  contact_birthday: string; // 15/03/1986
  contact_nationality: string; // 75
  contact_family_status: string; // 100
  contact_children: string; // 1
  address: string[]; // line1|^|1206|^|geneva|^|186|^|1|^|note6|^|line2|^|line3
  contact_company: string; // rfs
  contact_job: string; // super
  contact_banking_reference: string; // aucunelol
  contact_direct_client: string; // 1
  contact_intermediate: string; //
  contact_origin: string; // 275
  contact_notes: string; // contactnotes

  // Account
  account_id: string; // 4610
  account_agency_id: string; // 15
  account_login: string; // nicolas@realforce.ch
  password: string; //
  account_pwd: string; //
  account_pwd_confirm: string; //
  account_type: string; // 1
  account_type_hidden: string; // 1
  is_active_account: string; // 1
  account_expiry_date: string; // 20/10/2010
  account_user_profile: string; //  comment
  account_privilege: string[]; // ["1", "2", "3"]
  account_language: string; // en
  account_switch_accounts: string[]; // ['{"id":"","accountId":"4611","accountLogin":"bob@myagency.ch","isRemoved":false}']

  // Contact search, for now useless
  current_contact_search_id: string; //
  contact_search_manager: string; // 0
  contact_search_title: string; //
  contact_search_notes: string; //
  contact_transaction_type: string; //  0
  contact_search_type: string; //
  contact_main_category: string; // 0
  contact_sub_category: string; // 0
  contact_zip_code_search: string; //
  contact_bedroom_min: string; //
  contact_bedroom_max: string; //
  contact_room_min: string; //
  contact_room_max: string; //
  contact_habitable_min: string; //
  contact_habitable_max: string; //
  contact_price_min: string; //
  contact_price_max: string; //
  contact_furnishing: string; //
  contact_position: string; //
  contact_style: string; //
  contact_view: string; //
  contact_sonority: string; //
  contact_land_min: string; //
  contact_land_max: string; //
  contact_margin_price: string; //
  contact_margin_room: string; //
  contact_margin_area: string; //
  contact_margin_bedroom: string; //
  contact_margin_land: string; //
  contact_search_spaces: string; //
  search_sector: string; //
}
