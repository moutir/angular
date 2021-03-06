export const enum RuntimeDataEnum {
  settings = 'settings',
  userPreference = 'user_preference',
  agencyPreference = 'agency_preference',
  agency = 'agency',
  authentication = 'authentication',
  permissions = 'permissions',
  contactTypeByGroup = 'contact_type_by_group',
  feature = 'feature',
  featureAccount = 'feature_account',
  featureBrochure = 'feature_brochure',
  featurePrice = 'feature_price',
  featureProperty = 'feature_property',
  featureLead = 'feature_lead',
  featureMatching = 'feature_matching',
  featureReporting = 'feature_reporting',
  featurePromotion = 'feature_promotion',
  featureFisher = 'feature_fisher',
  featureTask = 'feature_task',
  featureContact = 'feature_contact',
  featureReport = 'feature_report',
  featureRestriction = 'feature_restriction',
  featurePortal = 'feature_portal',
  options = 'options',
  optionAgencyPreference = 'option_agency_preference',
  optionPropertyType = 'option_property_type',
  optionPropertyCategory = 'option_property_category',
  optionPropertySubCategory = 'option_property_subcategory',
  optionPropertyStatus = 'option_property_status',
  optionPriceSell = 'option_price_sell',
  optionPriceRent = 'option_price_rent',
  optionRoom = 'option_room',
  optionBedroom = 'option_bedroom',
  optionLivingArea = 'option_living_area',
  optionLandArea = 'option_land_area',
  optionPosition = 'option_position',
  optionView = 'option_view',
  optionPublicationStatus = 'option_publication_status',
  optionPublicationWebsite = 'option_publication_website',
  optionPublicationGateway = 'option_publication_gateway',
  optionVisibility = 'option_visibility',
  optionBrokerSell = 'option_broker_sell',
  optionBrokerRent = 'option_broker_rent',
  optionBrokerColleague = 'option_broker_colleague',
  optionBrokerByAgency = 'option_broker_by_agency',
  optionBrokerSellByAgency = 'option_broker_sell_by_agency',
  optionBrokerRentByAgency = 'option_broker_rent_by_agency',
  optionAgencyRelated = 'option_agency_related',
  optionAgencyUser = 'option_agency_user',
  optionAgencyMls = 'option_agency_mls',
  optionAgencyGroup = 'option_agency_group',
  optionAgencyGroupAll = 'option_agency_group_all',
  optionAgencyMlsAll = 'option_agency_mls_all',
  optionGroupOfAgency = 'option_group_of_agency',
  optionIsDirectTransaction01 = 'option_is_direct_transaction',
  optionIsPromotion01 = 'option_is_promotion',
  optionIsSellToForeigner01 = 'option_is_sell_to_foreigner',
  optionRanking = 'option_ranking',
  optionMatchingGroupEntity = 'option_matching_group_entity',
  optionMatchingGroupType = 'option_matching_group_type',
  optionMatchingProcessMethod = 'option_matching_process_method',
  optionMatchingStatus = 'option_matching_status',
  optionEmailTemplate = 'option_email_template',
  optionEmailContent = 'option_email_content',
  optionBrochureQuality = 'option_brochure_quality',
  optionBrochurePrivacy = 'option_brochure_privacy',
  optionLanguageCommunication = 'option_language_communication',
  optionReportingStatus = 'option_reporting_process_status',
  optionReportingType = 'option_reporting_type',
  optionLeadType = 'option_lead_type',
  optionLeadStatus = 'option_lead_status',
  optionLeadSource = 'option_lead_source',
  optionCountryById = 'option_country_by_id',
  optionCountryByCode = 'option_country_by_code',
  optionMotivation = 'option_motivation',
  optionPromotionStatus = 'option_promotion_status',
  optionTaskType = 'option_task_type',
  optionTaskStatus = 'option_task_status',
  optionCircle = 'option_circle',
  optionContactMode = 'option_contact_mode',
  optionContactType = 'option_contact_type',
  optionIsDirectClient01 = 'option_is_direct_client',
  optionTransaction = 'option_transaction',
  optionIsVip01 = 'option_is_vip',
  optionContactSearch = 'option_contact_search',
  optionContactSearchType = 'option_contact_search_type',
  optionLastContact = 'option_last_contact',
  optionArea = 'option_area',
  optionContactOrigin = 'option_contact_origin',
  optionSpace = 'option_space',
  optionPropertyBrochureType = 'option_property_brochure_type',
  optionPromotionBrochureType = 'option_promotion_brochure_type',
  optionIsArchive01 = 'option_is_archive',
  optionReportType = 'option_report_type',
  optionReportPropertyType = 'option_report_property_type',
  optionReportScheduleType = 'option_report_schedule_type',
  optionReportOwnerBrochureType = 'option_report_owner_brochure_type',
  optionReportOtherBrochureType = 'option_report_other_brochure_type',
  optionReportDeveloperBrochureType = 'option_report_developer_brochure_type',
  optionEmailStatus = 'option_email_status',
  optionEmailAttachmentType = 'option_email_attachment_type',
  optionContactSpecialType = 'option_contact_special_filters',
  optionDeviceType = 'option_device_type',
  optionAgencyUsers = 'option_agency_users',
  optionPortalLanguage = 'option_gateway_language',
  optionPortalSendLeadCopy = 'option_portal_send_lead_copy',
  optionPortalList = 'option_gateway_list',
  optionHasBroker = 'option_has_broker',
  optionHasInformation = 'option_has_information',
  optionHasPrice = 'option_has_price',
  optionHasLead = 'option_has_lead',
  optionHasSummary = 'option_has_summary',
  optionHasMarketingExpense = 'option_has_marketing_expense',
  optionHasTimeEvolution = 'option_has_time_evolution',
  optionHasOffer = 'option_has_offer',
  optionHasProposition = 'option_has_proposition',
  optionHasPastVisit = 'option_has_past_visit',
  optionHasPlannedVisit = 'option_has_planned_visit',
  optionHasCommunication = 'option_has_communication',
  optionCustomAttribute = 'option_custom_attribute',
  optionCustomAttributeUsable = 'option_custom_attribute_usable',
  optionSector = 'option_sector',
  optionFrequency = 'option_frequency',
  optionDateRange = 'option_date_range',
  optionContactRestrictLocation = 'option_contact_restrict_locations',
  optionHomePage = 'option_home_page',
  optionMenuDisplay  = 'option_menu_display',
  optionContactTitle  = 'option_contact_title',
  optionContactGreeting  = 'option_contact_greeting',
  optionNationality  = 'option_nationality',
  optionMaritalStatus  = 'option_marital_status',
  optionChildren  = 'option_children',
  optionPipelineStage  = 'option_pipeline_stage',
  optionSocialMedia  = 'option_social_media',
  optionOfferStatus = 'option_offer_status',
  optionOfferConfidence = 'option_offer_confidence',
  optionCurrency = 'option_currency',
  optionSellType = 'option_sell_type',
  optionAccountType = 'option_account_type',
  optionPropertyContractStep = 'option_property_contract_step',
  optionPropertyContractSellType = 'option_property_contract_sell_type',
  optionPropertyContractContactType = 'option_property_contract_contact_type',
  optionPropertyContractCommissionType = 'option_property_contract_commission_type',
  optionReminderAt = 'option_reminder_at',
  optionAgenda = 'option_agenda',
  optionTransactionType = 'option_transaction_type',
  optionMedia = 'option_media',
  optionWebsiteLayout = 'option_website_layout',
  optionWebsiteTemplate = 'option_website_template',
  optionSuggestionStatus = 'option_suggestion_status',
  optionSuggestionTag = 'option_suggestion_tag',
  optionSuggestionVote = 'option_suggestion_vote',
  optionIsActive01 = 'option_is_active',
  optionProcessType = 'option_process_type',
  optionProcessStatus = 'option_process_status',
}
