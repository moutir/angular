import { LegacyContactDataInterface } from '../../format/legacy/data/legacy-contact-data.interface';
import { LegacyAgencyDataInterface } from '../../format/legacy/data/legacy-agency-data.interface';

export interface ContactLoadResponseInterface {
  contact: {
    editable: boolean;
    majorInformationEditable: boolean;
    values: {
      account_id: string; // "4610"
      account_privilege: string[]; // ["1", "2", "3", "4"]
      account_type: string; // "1"
      addresses: string[]; // ["line1|^|1206|^|geneva|^|186|^|1|^|note6|^|line2|^|line3"]
      agency: {
        contact_margin_area: number; // 10
        contact_margin_bedroom: string; // "0"
        contact_margin_land: number; // 100
        contact_margin_price: number; // 20
        contact_margin_room: string; // "1"
      };
      contact_agency: LegacyAgencyDataInterface;
      banking_reference: string; // "aucunelol";
      birthday: string; // "15/03/1986";
      birthday_mysql: string; // "1986-03-15";
      children: string; // "1";
      company: string; // "rfs";
      contact_custom_attribute: string[]; // ["6"];
      contact_id: string; // "1072504";
      contact_types: string[]; // ["8", "9", "13"]
      created_by: string; // "Ghislain BANACHE"
      creation: string; // "22/08/2019 10:43"
      direct_client: number; // 1
      emails: string[]; // ["nicolas@realforce.ch|^|1|^||^|1|^|", "nicolas+alt@realforce.ch|^||^||^|1|^|"]
      expiry_date: string; // ""
      expiry_date_mysql: string; // ""
      facebook: string; // "face"
      family_status: string; // "100"
      firstName: string; // "Nicolas"
      firstName2: string; // "2prenom"
      greeting: string; // "323"
      hidden_on_mls_agency_profile: number; // 0
      instagram: string; // "insta"
      intermediate: null|string;
      is_active: number; // 1
      is_archived: number; // 0
      is_main_contact_myagency: number; // true
      job: string; // "super"
      landLines: string[]; // ["+41 79 504 1786|^|1|^|note4", "0987654|^||^|note5"]
      language: string; // "en"
      lastName: string; // "Favaron"
      lastName2: string; // "2nom"
      last_contact_time: string; // "Jamais contacté"
      linkedin: string; // "linked"
      login: string; // "nicolas@realforce.ch"
      main_contact: string; // "59948"
      main_contact_name: string; // "Banache Ghislain"
      mobiles: string[]; // ["123456|^|1|^|note", "6543|^||^|note2"]
      nationality: string; // "75"
      notes: string; // "i am the notes"
      origin: number; // 1
      ranking: number; // 0
      reference: string; // "RN-GB-4mrvtzbq"
      rental_contact: null|string; // null or "123"
      sale_contact: null|string; // null or "123"
      stage: string; // "2"
      title: string; // "127"
      twitter: string; // "twit"
      update: string; // "26/01/2021 12:46"
      updated_by: string; // "Nicolas FAVARON"
      user_profile: string;
      vip: number; // 1
      visibility: string; // "132"
      account_type_label: string;
      create_contact: LegacyContactDataInterface;
      create_date: string;
      update_contact: LegacyContactDataInterface;
      update_date: string;
      account_language: string;
      account_language_label: string;
      account_enable_google_agenda: string;
      account_allow_switching_to_this_account: string;
      account_allow_send_on_behalf: string;
      account_last_login_date: string;
      account_last_seen_date: string;
      account_last_seen_ip: string;
      account_last_seen_user_agent: string;
      account_switch_accounts: Array<{ id: string; accountId: string; accountLogin: string; }>;
      main_contact_initials: string;
      initials: string;
    };
  };
  is_owner: boolean;
  success: boolean;
}
