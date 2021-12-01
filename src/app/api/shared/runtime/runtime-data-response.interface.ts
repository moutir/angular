import { OptionInterface } from '../../../shared/interface/option.interface';
import { AreaUnitEnum } from '../../../shared/enum/area-unit.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { OptionGroupInterface } from '../../../shared/interface/option-group.interface';
import { RuntimeUserPreferenceInterface } from '../../../shared/interface/runtime-user-preference.interface';
import { OptionGroupCustomAttributeInterface } from '../../../shared/interface/option-group-custom-attribute.interface';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { RuntimeContactTypeByGroupInterface } from '../../../shared/interface/runtime-contact-type-by-group.interface';
import { ViewportAutofitType } from '../../../shared/type/viewport-autofit.type';
import { OptionOfOptionsInterface } from '../../../shared/interface/option-of-options.interface';
import { RuntimeFeatureRestrictionInterface } from '../../../shared/interface/runtime-feature-restriction.interface';
import { RuntimeFeatureAccountInterface } from '../../../shared/interface/runtime-feature-account.interface';
import { RuntimeFeaturePortalInterface } from '../../../shared/interface/runtime-feature-portal.interface';
import { RuntimeFeatureInterface } from '../../../shared/interface/runtime-feature.interface';

export interface RuntimeDataResponseInterface {

  settings?: {
    per_page: number[];
    language: {
      current: LanguageEnum;
      available: KeyValueType<LanguageEnum, string>;
    };
    map: {
      coordinates: {
        lat: number;
        lng: number;
      };
      zoom_percentage: number;
    };
    polygon: {
      max_count: number;
      vertices_max_count: number;
      colors: string[];
      viewport_autofit: ViewportAutofitType;
    };
    currency_code: string;
    area_unit: AreaUnitEnum;
    export_limit: number;
    email_limit: number;
  };

  agency_preference?: {
    [id: string]: string;
  };

  option_agency_preference?: Array<{
    name: string;
    preferences: Array<{
      id: string;
      name: string;
      input_type: string;
      default_value: string;
      available_options: string[];
    }>;
  }>;

  user_preference?: RuntimeUserPreferenceInterface;

  authentication?: {
    agency_id: string;
    contact_id: string;
    is_multi_agency: boolean;
    is_beta_tester: boolean;
  };

  permissions?: PermissionEnum[];

  contact_type_by_group?: RuntimeContactTypeByGroupInterface;

  feature?: RuntimeFeatureInterface;

  feature_account?: RuntimeFeatureAccountInterface;

  feature_price?: {
    frequency: KeyValueType<string, string>;
  };

  feature_property?: {
    list_default_status_id: number[];
  };

  feature_lead?: {
    list_default_status_id: number[];
  };

  feature_matching?: {
    email_template: KeyValueType<string, string>;
    email_content: KeyValueType<string, string>;
    email_brochure_type: KeyValueType<string, string>;
    email_brochure_privacy: KeyValueType<string, string>;
  };

  feature_reporting?: {
    list_default_process_status_id: number[];
  };

  feature_promotion?: {

  };

  feature_task?: {
    list_default_status_id: number;
    is_agenda_enabled: boolean;
  };

  feature_report?: {
    list_default_property_type_id: number[];
    is_scheduler_enabled: boolean;
  };

  feature_email_sent?: {};

  feature_fisher?: {
    category_id_floor_required: number[];
  };

  feature_brochure?: {
    default_brochure_type_id: string;
    mapping: {
      privacy_id_x_privacy_type: KeyValueType<string, string>;
      brochure_id_x_brochure_type: KeyValueType<string, string>;
      brochure_id_x_privacy_ids: KeyValueType<string, string[]>;
    };
  };

  feature_restriction?: RuntimeFeatureRestrictionInterface;
  feature_portal?: RuntimeFeaturePortalInterface;

  option_property_type?: OptionInterface[];
  option_property_category?: OptionInterface[];
  option_property_subcategory?: OptionInterface[];
  option_property_status?: OptionInterface[];
  option_price_sell?: OptionInterface[];
  option_price_rent?: OptionInterface[];
  option_room?: OptionInterface[];
  option_bedroom?: OptionInterface[];
  option_living_area?: OptionInterface[];
  option_land_area?: OptionInterface[];
  option_position?: OptionInterface[];
  option_view?: OptionInterface[];
  option_publication_status?: OptionInterface[];
  option_publication_website?: OptionInterface[];
  option_publication_gateway?: OptionInterface[];
  option_visibility?: OptionInterface[];
  option_broker_sell?: OptionInterface[];
  option_broker_rent?: OptionInterface[];
  option_broker_colleague?: OptionInterface[];
  option_broker_by_agency?: OptionGroupInterface[];
  option_broker_sell_by_agency?: OptionGroupInterface[];
  option_broker_rent_by_agency?: OptionGroupInterface[];
  option_agency_related?: OptionInterface[];
  option_agency_user?: OptionInterface;
  option_agency_mls_all?: OptionInterface;
  option_agency_mls?: OptionInterface[];
  option_agency_group_all?: OptionInterface;
  option_agency_group?: OptionInterface[];
  option_group_of_agency?: OptionInterface[];
  option_is_direct_transaction?: OptionInterface[];
  option_is_promotion?: OptionInterface[];
  option_is_sell_to_foreigner?: OptionInterface[];
  option_ranking?: OptionInterface[];
  option_matching_group_entity?: OptionInterface[];
  option_matching_group_type?: OptionInterface[];
  option_matching_process_method?: OptionInterface[];
  option_matching_status?: OptionInterface[];
  option_email_template?: OptionInterface[];
  option_email_content?: OptionGroupInterface[];
  option_brochure_quality?: OptionInterface[];
  option_brochure_privacy?: OptionInterface[];
  option_language_communication?: OptionInterface[];
  option_reporting_process_status?: OptionInterface[];
  option_reporting_type?: OptionInterface[];
  option_lead_type?: OptionInterface[];
  option_lead_broker?: OptionInterface[];
  option_lead_status?: OptionInterface[];
  option_lead_source?: OptionInterface[];
  option_country_by_id?: OptionInterface[];
  option_country_by_code?: OptionInterface[];
  option_motivation?: OptionInterface[];
  option_promotion_status?: OptionInterface[];
  option_task_type?: OptionInterface[];
  option_task_status?: OptionInterface[];
  option_contact_mode?: OptionInterface[];
  option_contact_type?: OptionOfOptionsInterface[];
  option_is_direct_client?: OptionInterface[];
  option_transaction?: OptionInterface[];
  option_is_vip?: OptionInterface[];
  option_contact_search?: OptionInterface[];
  option_contact_search_type?: OptionInterface[];
  option_last_contact?: OptionInterface[];
  option_area?: OptionInterface[];
  option_space?: OptionInterface[];
  option_contact_origin?: OptionOfOptionsInterface[];
  option_property_brochure_type?: OptionInterface[];
  option_promotion_brochure_type?: OptionInterface[];
  option_is_archive?: OptionInterface[];
  option_report_type?: OptionInterface[];
  option_report_property_type?: OptionInterface[];
  option_report_schedule_type?: OptionInterface[];
  option_report_owner_brochure_type?: OptionInterface[];
  option_report_other_brochure_type?: OptionInterface[];
  option_report_developer_brochure_type?: OptionInterface[];
  option_email_attachment_type?: OptionInterface[];
  option_email_status?: OptionInterface[];
  option_contact_special_filters?: OptionInterface[];
  option_device_type?: OptionInterface[];
  option_agency_users?: OptionInterface[];
  option_gateway_language?: OptionInterface[];
  option_sector?: OptionInterface[];
  option_portal_send_lead_copy?: OptionInterface[];
  option_gateway_list?: OptionInterface[];
  option_has_broker?: OptionInterface[];
  option_has_information?: OptionInterface[];
  option_has_price?: OptionInterface[];
  option_has_lead?: OptionInterface[];
  option_has_summary?: OptionInterface[];
  option_has_marketing_expense?: OptionInterface[];
  option_has_time_evolution?: OptionInterface[];
  option_has_offer?: OptionInterface[];
  option_has_proposition?: OptionInterface[];
  option_has_past_visit?: OptionInterface[];
  option_has_planned_visit?: OptionInterface[];
  option_has_communication?: OptionInterface[];
  option_custom_attribute?: OptionGroupCustomAttributeInterface[];
  option_custom_attribute_usable?: OptionInterface[];
  option_frequency?: OptionInterface[];
  option_date_range?: OptionInterface[];
  option_contact_restrict_locations?: OptionInterface[];
  option_home_page?: OptionInterface[];
  option_menu_layout?: OptionInterface[];
  option_menu_display?: OptionInterface[];
  option_contact_title?: OptionInterface[];
  option_contact_greeting?: OptionInterface[];
  option_nationality?: OptionInterface[];
  option_marital_status?: OptionInterface[];
  option_children?: OptionInterface[];
  option_pipeline_stage?: OptionInterface[];
  option_social_media?: OptionInterface[];
  option_offer_status?: OptionInterface[];
  option_offer_confidence?: OptionInterface[];
  option_currency?: OptionInterface[];
  option_sell_type?: OptionInterface[];
  option_account_type?: OptionInterface[];
  option_property_contract_contact_type?: OptionInterface[];
  option_property_contract_step?: OptionInterface[];
  option_property_contract_commission_type?: OptionInterface[];
  option_property_contract_sell_type?: OptionInterface[];
  option_reminder_at?: OptionInterface[];
  option_agenda?: OptionInterface[];
  option_transaction_type?: OptionInterface[];
  option_media?: OptionInterface[];
  option_website_layout?: OptionInterface[];
  option_website_template?: OptionInterface[];
  option_suggestion_status?: OptionInterface[];
  option_suggestion_tag?: OptionInterface[];
  option_suggestion_vote?: OptionInterface[];
  option_is_active?: OptionInterface[];
  option_process_status?: OptionInterface[];
  option_process_type?: OptionInterface[];
  option_circle?: OptionInterface[];
}
