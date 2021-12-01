import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataRuntimeStateInterface } from '../../core-store/data-runtime/state';
import { RuntimeDataEnum } from '../../shared/enum/runtime-data.enum';
import { RuntimeDataResponseInterface } from '../../api/shared/runtime/runtime-data-response.interface';
import { RuntimeOptionsInterface } from '../../shared/interface/runtime-options.interface';
import { OptionInterface } from '../../shared/interface/option.interface';
import { OptionGroupInterface } from '../../shared/interface/option-group.interface';
import { FrequencyEnum } from '../../shared/enum/frequency.enum';
import { OptionOfOptionsInterface } from '../../shared/interface/option-of-options.interface';

export class RuntimeDataProvider {

  /**
   * Load data keys and return partial runtime data
   */
  provide(keys: RuntimeDataEnum[]): Observable<Partial<DataRuntimeStateInterface>> {

    return this
      .load(keys)
      .pipe(map(response => this.parse(response)));
  }

  /**
   * Return an observable of runtime data response
   */
  protected load(keys: RuntimeDataEnum[]): Observable<RuntimeDataResponseInterface> {

    return of({});
  }

  /**
   * Parse data response and return as DataRuntimeStateInterface
   */
  protected parse(response: RuntimeDataResponseInterface): Partial<DataRuntimeStateInterface> {

    const data: Partial<DataRuntimeStateInterface> = {};

    // Settings
    const settings = response.settings;

    if (settings) {

      data.settings = {
        perPage: settings.per_page.map(value => parseInt(String(value), 10)),
        language: {
          current: settings.language.current,
          available: settings.language.available,
        },
        map: {
          centerCoordinates: {
            lat: parseFloat(String(settings.map.coordinates.lat)),
            lng: parseFloat(String(settings.map.coordinates.lng)),
          },
          zoomPercentage: parseInt(String(settings.map.zoom_percentage), 10),
        },
        polygon: {
          maxCount: parseInt(String(settings.polygon.max_count), 10),
          verticesMaxCount: parseInt(String(settings.polygon.vertices_max_count), 10),
          colors: settings.polygon.colors,
          viewportAutofit: settings.polygon.viewport_autofit,
          isEditable: false,
          isDisabled: true,
          isConfirmDelete: true,
        },
        currency: settings.currency_code,
        areaUnit: settings.area_unit,
        exportLimit: settings.export_limit,
        emailLimit: settings.email_limit,
      };
    }

    // Preference user
    const userPreference = response.user_preference;

    if (userPreference) {

      data.userPreference = userPreference;
    }

    // Preference agency
    const agencyPreference = response.agency_preference;

    if (agencyPreference) {

      data.agencyPreference = agencyPreference;
    }

    // Authentication
    const authentication = response.authentication;

    if (authentication) {

      data.authentication = {
        agencyId: String(response.authentication.agency_id),
        contactId: String(response.authentication.contact_id),
        isMultiAgency: response.authentication.is_multi_agency,
        isBetaTester: !!response.authentication.is_beta_tester,
      };
    }

    // Permissions
    const permissions = response.permissions;

    if (permissions) {

      data.permissions = response.permissions;
    }

    // Contact types by group
    const contactTypeByGroup = response.contact_type_by_group;

    if (contactTypeByGroup) {

      data.contactTypeByGroup = {
        client: response.contact_type_by_group.client,
        broker: response.contact_type_by_group.broker,
        intermediate: response.contact_type_by_group.intermediate,
        extra: response.contact_type_by_group.extra,
        other: response.contact_type_by_group.other,
      };
    }

    // Feature
    const feature = response.feature;

    if (feature) {

      data.feature = {
        ...response.feature,
      };
    }

    // Account feature
    const featureAccount = response.feature_account;

    if (featureAccount) {

      data.featureAccount = {
        ...response.feature_account,
      };
    }

    // Price feature
    const featurePrice = response.feature_price;

    if (featurePrice) {

      data.featurePrice = {
        frequency: {},
      };

      const frequency = [
        <string>FrequencyEnum.weekly,
        <string>FrequencyEnum.monthly,
        <string>FrequencyEnum.trimesterly,
        <string>FrequencyEnum.semesterly,
        <string>FrequencyEnum.yearly,
      ];

      Object
        .keys(featurePrice.frequency)
        .forEach(frequencyId => {

          if (frequency.indexOf(featurePrice.frequency[frequencyId]) === -1) {

            return;
          }

          data.featurePrice.frequency[frequencyId] = <FrequencyEnum>featurePrice.frequency[frequencyId];
        });
    }

    // Property feature
    const featureProperty = response.feature_property;

    if (featureProperty) {

      data.featureProperty = {
        listDefaultStatusId: featureProperty.list_default_status_id.map(value => String(value)),
      };
    }

    // Lead feature
    const featureLead = response.feature_lead;

    if (featureLead) {

      data.featureLead = {
        listDefaultStatusId: featureLead.list_default_status_id.map(value => String(value)),
      };
    }

    // Matching feature
    const featureMatching = response.feature_matching;

    if (featureMatching) {

      data.featureMatching = {
        emailTemplate: {},
        emailContent: {},
        emailBrochureType: {},
        emailBrochurePrivacy: {},
      };

      // Convert matching keys & values to string
      Object.keys(featureMatching.email_template).forEach(type => {

        data.featureMatching.emailTemplate[String(type)] = String(featureMatching.email_template[type]);
      });

      Object.keys(featureMatching.email_content).forEach(type => {

        data.featureMatching.emailContent[String(type)] = String(featureMatching.email_content[type]);
      });

      Object.keys(featureMatching.email_brochure_type).forEach(type => {

        data.featureMatching.emailBrochureType[String(type)] = String(featureMatching.email_brochure_type[type]);
      });

      Object.keys(featureMatching.email_brochure_privacy).forEach(type => {

        data.featureMatching.emailBrochurePrivacy[String(type)] = String(featureMatching.email_brochure_privacy[type]);
      });
    }

    // Reporting feature
    const featureReporting = response.feature_reporting;

    if (featureReporting) {

      data.featureReporting = {
        listDefaultProcessStatusId: featureReporting.list_default_process_status_id.map(value => String(value)),
      };
    }

    // Promotion feature
    const featurePromotion = response.feature_promotion;

    if (featurePromotion) {

      data.featurePromotion = {};
    }

    // Task feature
    const featureTask = response.feature_task;

    if (featureTask) {

      data.featureTask = {
        listDefaultStatusId: String(featureTask.list_default_status_id),
        isAgendaEnabled: featureTask.is_agenda_enabled,
      };
    }

    // Report feature
    const featureReport = response.feature_report;

    if (featureReport) {

      data.featureReport = {
        listDefaultPropertyTypeId: String(featureReport.list_default_property_type_id),
        isSchedulerEnabled: featureReport.is_scheduler_enabled,
      };
    }

    // Email sent feature
    const featureEmailSent = response.feature_email_sent;

    if (featureEmailSent) {

      data.featureEmailSent = {};
    }

    // Fisher feature
    const featureFisher = response.feature_fisher;

    if (featureFisher) {

      data.featureFisher = {
        categoryIdFloorRequired: featureFisher.category_id_floor_required.map(value => String(value)),
      };
    }

    // Brochure feature
    const featureBrochure = response.feature_brochure;

    if (featureBrochure) {

      data.featureBrochure = {
        defaultBrochureTypeId: featureBrochure.default_brochure_type_id,
        mapping: {
          privacyIdToPrivacyType: featureBrochure.mapping.privacy_id_x_privacy_type,
          brochureIdToBrochureType: featureBrochure.mapping.brochure_id_x_brochure_type,
          brochureIdToPrivacyIds: featureBrochure.mapping.brochure_id_x_privacy_ids,
        },
      };
    }

    // Restriction feature
    const featureRestriction = response.feature_restriction;

    if (featureRestriction) {

      data.featureRestriction = {
        ...featureRestriction,
      };
    }

    // Portal feature
    const featurePortal = response.feature_portal;

    if (featurePortal) {

      data.featurePortal = {
        ...featurePortal,
      };
    }

    // Options
    data.options = <RuntimeOptionsInterface>{};
    data.options.propertyType = this.toOptions(response.option_property_type);
    data.options.propertyCategory = this.toOptions(response.option_property_category);
    data.options.propertyStatus = this.toOptions(response.option_property_status);
    data.options.priceSell = this.toOptions(response.option_price_sell);
    data.options.priceRent = this.toOptions(response.option_price_rent);
    data.options.room = this.toOptions(response.option_room);
    data.options.bedroom = this.toOptions(response.option_bedroom);
    data.options.livingArea = this.toOptions(response.option_living_area);
    data.options.landArea = this.toOptions(response.option_land_area);
    data.options.position = this.toOptions(response.option_position);
    data.options.view = this.toOptions(response.option_view);
    data.options.publicationStatus = this.toOptions(response.option_publication_status);
    data.options.publicationWebsite = this.toOptions(response.option_publication_website);
    data.options.publicationGateway = this.toOptions(response.option_publication_gateway);
    data.options.visibility = this.toOptions(response.option_visibility);
    data.options.brokerSell = this.toOptions(response.option_broker_sell);
    data.options.brokerRent = this.toOptions(response.option_broker_rent);
    data.options.brokerColleague = this.toOptions(response.option_broker_colleague);
    data.options.brokerByAgency = this.toOptionGroups(response.option_broker_by_agency);
    data.options.brokerSellByAgency = this.toOptionGroups(response.option_broker_sell_by_agency);
    data.options.brokerRentByAgency = this.toOptionGroups(response.option_broker_rent_by_agency);
    data.options.agencyRelated = this.toOptions(response.option_agency_related);
    data.options.agencyUser = response.option_agency_user ?
      this.toOptions([response.option_agency_user])[0] : null;
    data.options.agencyMls = this.toOptions(response.option_agency_mls);
    data.options.agencyGroup = this.toOptions(response.option_agency_group);
    data.options.agencyGroupAll = response.option_agency_group_all ?
      this.toOptions([response.option_agency_group_all])[0] : null;
    data.options.agencyMlsAll = response.option_agency_mls_all ?
      this.toOptions([response.option_agency_mls_all])[0] : null;
    data.options.groupOfAgency = this.toOptions(response.option_group_of_agency);
    data.options.isDirectTransaction01 = this.toOptions(response.option_is_direct_transaction);
    data.options.isPromotion01 = this.toOptions(response.option_is_promotion);
    data.options.isSellToForeigner01 = this.toOptions(response.option_is_sell_to_foreigner);
    data.options.ranking = this.toOptions(response.option_ranking);
    data.options.matchingGroupEntity = this.toOptions(response.option_matching_group_entity);
    data.options.matchingGroupType = this.toOptions(response.option_matching_group_type);
    data.options.matchingProcessMethod = this.toOptions(response.option_matching_process_method);
    data.options.matchingStatus = this.toOptions(response.option_matching_status);
    data.options.emailTemplate = this.toOptions(response.option_email_template);
    data.options.emailContent = this.toOptionGroups(response.option_email_content);
    data.options.brochureQuality = this.toOptions(response.option_brochure_quality);
    data.options.brochurePrivacy = this.toOptions(response.option_brochure_privacy);
    data.options.languageCommunication = this.toOptions(response.option_language_communication);
    data.options.reportingStatus = this.toOptions(response.option_reporting_process_status);
    data.options.reportingType = this.toOptions(response.option_reporting_type);
    data.options.leadType = this.toOptions(response.option_lead_type);
    data.options.leadStatus = this.toOptions(response.option_lead_status);
    data.options.leadSource = this.toOptions(response.option_lead_source);
    data.options.countryById = this.toOptions(response.option_country_by_id);
    data.options.countryByCode = this.toOptions(response.option_country_by_code);
    data.options.motivation = this.toOptions(response.option_motivation);
    data.options.propertySubCategory = response.option_property_subcategory;
    data.options.promotionStatus = this.toOptions(response.option_promotion_status);
    data.options.taskType = this.toOptions(response.option_task_type);
    data.options.taskStatus = this.toOptions(response.option_task_status);
    data.options.contactMode = this.toOptions(response.option_contact_mode);
    data.options.contactType = this.toOptionOfOptions(response.option_contact_type);
    data.options.isDirectClient01 = this.toOptions(response.option_is_direct_client);
    data.options.transaction = this.toOptions(response.option_transaction);
    data.options.isVip01 = this.toOptions(response.option_is_vip);
    data.options.contactSearch = this.toOptions(response.option_contact_search);
    data.options.contactSearchType = this.toOptions(response.option_contact_search_type);
    data.options.lastContact = this.toOptions(response.option_last_contact);
    data.options.area = this.toOptions(response.option_area);
    data.options.contactOrigin = this.toOptionOfOptions(response.option_contact_origin);
    data.options.space = this.toOptions(response.option_space);
    data.options.propertyBrochureType = this.toOptions(response.option_property_brochure_type);
    data.options.promotionBrochureType = this.toOptions(response.option_promotion_brochure_type);
    data.options.isArchive01 = this.toOptions(response.option_is_archive);
    data.options.reportType = this.toOptions(response.option_report_type);
    data.options.reportPropertyType = this.toOptions(response.option_report_property_type);
    data.options.reportScheduleType = this.toOptions(response.option_report_schedule_type);
    data.options.reportOwnerBrochureType = this.toOptions(response.option_report_owner_brochure_type);
    data.options.reportOtherBrochureType = this.toOptions(response.option_report_other_brochure_type);
    data.options.reportDeveloperBrochureType = this.toOptions(response.option_report_developer_brochure_type);
    data.options.emailStatus = this.toOptions(response.option_email_status);
    data.options.emailAttachmentType = this.toOptions(response.option_email_attachment_type);
    data.options.contactSpecialType = this.toOptions(response.option_contact_special_filters);
    data.options.deviceType = this.toOptions(response.option_device_type);
    data.options.agencyUsers = this.toOptions(response.option_agency_users);
    data.options.portalLanguage = this.toOptions(response.option_gateway_language);
    data.options.sector = this.toOptions(response.option_sector);
    data.options.portalSendLeadCopy = this.toOptions(response.option_portal_send_lead_copy);
    data.options.portalList = this.toOptions(response.option_gateway_list);
    data.options.hasBroker = this.toOptions(response.option_has_broker);
    data.options.hasInformation = this.toOptions(response.option_has_information);
    data.options.hasPrice = this.toOptions(response.option_has_price);
    data.options.hasLead = this.toOptions(response.option_has_lead);
    data.options.hasSummary = this.toOptions(response.option_has_summary);
    data.options.hasMarketingExpense = this.toOptions(response.option_has_marketing_expense);
    data.options.hasTimeEvolution = this.toOptions(response.option_has_time_evolution);
    data.options.hasOffer = this.toOptions(response.option_has_offer);
    data.options.hasProposition = this.toOptions(response.option_has_proposition);
    data.options.hasPastVisit = this.toOptions(response.option_has_past_visit);
    data.options.hasPlannedVisit = this.toOptions(response.option_has_planned_visit);
    data.options.hasCommunication = this.toOptions(response.option_has_communication);
    data.options.customAttribute = response.option_custom_attribute;
    data.options.customAttributeUsable = this.toOptions(response.option_custom_attribute_usable);
    data.options.sector = this.toOptions(response.option_sector);
    data.options.frequency = this.toOptions(response.option_frequency);
    data.options.dateRange = this.toOptions(response.option_date_range);
    data.options.contactRestrictLocation = this.toOptions(response.option_contact_restrict_locations);
    data.options.homePage = this.toOptions(response.option_home_page);
    data.options.menuDisplay = this.toOptions(response.option_menu_display);
    data.options.contactTitle = this.toOptions(response.option_contact_title);
    data.options.contactGreeting = this.toOptions(response.option_contact_greeting);
    data.options.nationality = this.toOptions(response.option_nationality);
    data.options.maritalStatus = this.toOptions(response.option_marital_status);
    data.options.children = this.toOptions(response.option_children);
    data.options.pipelineStage = this.toOptions(response.option_pipeline_stage);
    data.options.socialMedia = this.toOptions(response.option_social_media);
    data.options.offerStatus = this.toOptions(response.option_offer_status);
    data.options.offerConfidence = this.toOptions(response.option_offer_confidence);
    data.options.currency = this.toOptions(response.option_currency);
    data.options.sellType = this.toOptions(response.option_sell_type);
    data.options.accountType = this.toOptions(response.option_account_type);
    data.options.propertyContractContactType = this.toOptions(response.option_property_contract_contact_type);
    data.options.propertyContractStep = this.toOptions(response.option_property_contract_step);
    data.options.propertyContractCommissionType = this.toOptions(response.option_property_contract_commission_type);
    data.options.propertyContractSellType = this.toOptions(response.option_property_contract_sell_type);
    data.options.reminderAt = this.toOptions(response.option_reminder_at);
    data.options.agenda = this.toOptions(response.option_agenda);
    data.options.transactionType = this.toOptions(response.option_transaction_type);
    data.options.media = this.toOptions(response.option_media);
    data.options.websiteLayout = this.toOptions(response.option_website_layout);
    data.options.websiteTemplate = this.toOptions(response.option_website_template);
    data.options.suggestionStatusIds = this.toOptions(response.option_suggestion_status);
    data.options.suggestionTagIds = this.toOptions(response.option_suggestion_tag);
    data.options.suggestionVoteIds = this.toOptions(response.option_suggestion_vote);
    data.options.isActive01 = this.toOptions(response.option_is_active);
    data.options.processStatusIds = this.toOptions(response.option_process_status);
    data.options.processTypeIds = this.toOptions(response.option_process_type);
    data.options.circle = this.toOptions(response.option_circle);

    // Agency preference options
    data.options.agencyPreference = response.option_agency_preference ? response.option_agency_preference.map(page => ({
      name: page.name,
      label: 'preference_group_' + page.name,
      preferences: page.preferences.map(option => ({
        id: option.id,
        name: option.name,
        label: 'preference_option_' + option.name,
        availableOptions: option.available_options.map(value => {

          return {
            value: value,
            text: 'preference_text_' + option.name + '_' + value,
            description: 'preference_description_' + option.name + '_' + value,
          };
        }),
        inputType: option.input_type,
        defaultValue: option.default_value,
      })),
    })) : null;

    // Every option is null
    if (Object.keys(data.options).every(key => data.options[key] === null)) {

      delete data.options;
    }

    return data;
  }

  /**
   * Cast the input options to an array of OptionInterface else return null
   */
  protected toOptions(options: Array<{
    value: number|string;
    text: number|string;
  }>): OptionInterface[]|null {

    if (!options) {

      return null;
    }

    return options.map(option => {

      return {
        value: String(option.value),
        text: String(option.text),
      };
    });
  }

  /**
   * Cast the input options to an array of OptionInterface else return null
   */
  protected toOptionOfOptions(options: Array<{
    value: number|string;
    text: number|string;
    options: Array<{
      value: number|string;
      text: number|string;
    }>;
  }>): OptionOfOptionsInterface[]|null {

    if (!options) {

      return null;
    }

    return options.map(option => {

      return {
        value: String(option.value),
        text: String(option.text),
        options: option.options.map(suboption => {

          return {
            value: String(suboption.value),
            text: String(suboption.text),
          };
        }),
      };
    });
  }

  /**
   * Cast the input option groups to an array of OptionGroupInterface else return null
   */
  protected toOptionGroups(optionGroups: Array<{
    label: string|number;
    options: Array<{
      value: number|string;
      text: number|string;
    }>;
  }>): OptionGroupInterface[]|null {

    if (!optionGroups) {

      return null;
    }

    return optionGroups.map(optionGroup => {

      return {
        label: String(optionGroup.label),
        options: this.toOptions(optionGroup.options),
      };
    });
  }
}
