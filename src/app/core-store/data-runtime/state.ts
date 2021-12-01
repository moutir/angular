import { RuntimeSettingsInterface } from '../../shared/interface/runtime-settings.interface';
import { AreaUnitEnum } from '../../shared/enum/area-unit.enum';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { RuntimeOptionsInterface } from '../../shared/interface/runtime-options.interface';
import { RuntimeAuthenticationInterface } from '../../shared/interface/runtime-authentication.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeFeatureMatchingInterface } from '../../shared/interface/runtime-feature-matching.interface';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { RuntimeFeaturePropertyInterface } from '../../shared/interface/runtime-feature-property.interface';
import { RuntimeFeatureLeadInterface } from '../../shared/interface/runtime-feature-lead.interface';
import { RuntimeDataEnum } from '../../shared/enum/runtime-data.enum';
import { RuntimeFeaturePromotionInterface } from '../../shared/interface/runtime-feature-promotion.interface';
import { RuntimeFeatureFisherInterface } from '../../shared/interface/runtime-feature-fisher.interface';
import { RuntimeUserPreferenceInterface } from '../../shared/interface/runtime-user-preference.interface';
import { RuntimeAgencyPreferenceInterface } from '../../shared/interface/runtime-agency-preference.interface';
import { RuntimeFeatureTaskInterface } from '../../shared/interface/runtime-feature-task.interface';
import { RuntimeFeatureContactInterface } from '../../shared/interface/runtime-feature-contact.interface';
import { RuntimeFeaturePriceInterface } from '../../shared/interface/runtime-feature-price.interface';
import { RuntimeFeatureReportingInterface } from '../../shared/interface/runtime-feature-reporting.interface';
import { RuntimeFeatureReportInterface } from '../../shared/interface/runtime-feature-report.interface';
import { RuntimeFeatureEmailSentInterface } from '../../shared/interface/runtime-feature-email-sent.interface';
import { KeyValueType } from '../../shared/type/key-value.type';
import { RuntimeContactTypeByGroupInterface } from '../../shared/interface/runtime-contact-type-by-group.interface';
import { RuntimeFeatureBrochureInterface } from '../../shared/interface/runtime-feature-brochure.interface';
import { RuntimeFeatureRestrictionInterface } from '../../shared/interface/runtime-feature-restriction.interface';
import { RuntimeFeatureAccountInterface } from '../../shared/interface/runtime-feature-account.interface';
import { RuntimeFeaturePortalInterface } from '../../shared/interface/runtime-feature-portal.interface';

export const FEATURE_NAME = 'data-runtime';

export interface DataRuntimeStateInterface {

  // List of runtime data loaded timestamps
  loadedTimestamp: {
    [key in RuntimeDataEnum]?: number;
  };

  // General settings
  settings: RuntimeSettingsInterface;

  // Agency preference
  agencyPreference: RuntimeAgencyPreferenceInterface;

  // User preference
  userPreference: RuntimeUserPreferenceInterface;

  // Authentication information
  authentication: RuntimeAuthenticationInterface;

  // Contact type IDs per group
  contactTypeByGroup: RuntimeContactTypeByGroupInterface;

  // List of permissions granted
  permissions: PermissionEnum[];

  // Form options
  options: RuntimeOptionsInterface;

  // Features enabled/disabled
  feature: RuntimeFeatureInterface;

  // Account feature
  featureAccount: RuntimeFeatureAccountInterface;

  // Price feature
  featurePrice: RuntimeFeaturePriceInterface;

  // Property feature
  featureProperty: RuntimeFeaturePropertyInterface;

  // Lead feature
  featureLead: RuntimeFeatureLeadInterface;

  // Matching feature
  featureMatching: RuntimeFeatureMatchingInterface;

  // Reporting feature
  featureReporting: RuntimeFeatureReportingInterface;

  // Promotion feature
  featurePromotion: RuntimeFeaturePromotionInterface;

  // Fisher feature
  featureFisher: RuntimeFeatureFisherInterface;

  // Task feature
  featureTask: RuntimeFeatureTaskInterface;

  // Contact feature
  featureContact: RuntimeFeatureContactInterface;

  // Report feature
  featureReport: RuntimeFeatureReportInterface;

  // Email sent feature
  featureEmailSent: RuntimeFeatureEmailSentInterface;

  // Brochure feature
  featureBrochure: RuntimeFeatureBrochureInterface;

  // Restriction feature
  featureRestriction: RuntimeFeatureRestrictionInterface;

  // Portal feature
  featurePortal: RuntimeFeaturePortalInterface;
}

export const initialState: DataRuntimeStateInterface = {
  loadedTimestamp: {},
  settings: {
    perPage: [],
    language: {
      current: LanguageEnum.en,
      available: <KeyValueType<LanguageEnum, string>>{},
    },
    map: {
      centerCoordinates: {
        lat: 46.874977,
        lng: 7.854430,
      },
      zoomPercentage: 45,
    },
    polygon: {
      maxCount: 3,
      verticesMaxCount: 5,
      colors: ['#000000'],
      viewportAutofit: 'once',
      isEditable: false,
      isDisabled: true,
      isConfirmDelete: true,
    },
    currency: '',
    areaUnit: AreaUnitEnum.sqm,
    exportLimit: 0,
    emailLimit: 0,
  },
  agencyPreference: {},
  userPreference: {
    searchlist: {},
    beta: {},
  },
  authentication: {
    agencyId: '',
    contactId: '',
    isMultiAgency: false,
    isBetaTester: false,
  },
  contactTypeByGroup: {
    client: [],
    broker: [],
    intermediate: [],
    extra: [],
    other: [],
  },
  permissions: [],
  options: {
    propertyType: [],
    propertyCategory: [],
    propertySubCategory: [],
    propertyStatus: [],
    priceSell: [],
    priceRent: [],
    room: [],
    bedroom: [],
    livingArea: [],
    landArea: [],
    position: [],
    view: [],
    publicationStatus: [],
    publicationWebsite: [],
    publicationGateway: [],
    visibility: [],
    brokerSell: [],
    brokerRent: [],
    brokerColleague: [],
    brokerByAgency: [],
    brokerSellByAgency: [],
    brokerRentByAgency: [],
    agencyRelated: [],
    agencyUser: {
      value: '',
      text: '',
    },
    agencyMls: [],
    agencyGroup: [],
    agencyGroupAll: {
      value: '',
      text: '',
    },
    agencyMlsAll: {
      value: '',
      text: '',
    },
    groupOfAgency: [],
    isDirectTransaction01: [],
    isPromotion01: [],
    isSellToForeigner01: [],
    ranking: [],
    matchingGroupEntity: [],
    matchingGroupType: [],
    matchingProcessMethod: [],
    matchingStatus: [],
    emailTemplate: [],
    emailContent: [],
    brochureQuality: [],
    brochurePrivacy: [],
    languageCommunication: [],
    reportingStatus: [],
    reportingType: [],
    leadType: [],
    leadBroker: [],
    leadStatus: [],
    leadSource: [],
    countryById: [],
    countryByCode: [],
    motivation: [],
    promotionStatus: [],
    agencyPreference: [],
    taskType: [],
    taskStatus: [],
    circle: [],
    contactMode: [],
    contactType: [],
    transaction: [],
    isDirectClient01: [],
    isVip01: [],
    contactSearch: [],
    contactSearchType: [],
    lastContact: [],
    area: [],
    contactOrigin: [],
    propertyBrochureType: [],
    promotionBrochureType: [],
    isArchive01: [],
    reportType: [],
    reportPropertyType: [],
    reportScheduleType: [],
    reportOwnerBrochureType: [],
    reportOtherBrochureType: [],
    reportDeveloperBrochureType: [],
    emailAttachmentType: [],
    emailStatus: [],
    space: [],
    contactSpecialType: [],
    deviceType: [],
    agencyUsers: [],
    portalLanguage: [],
    sector: [],
    portalSendLeadCopy: [],
    portalList: [],
    hasBroker: [],
    hasInformation: [],
    hasPrice: [],
    hasLead: [],
    hasSummary: [],
    hasMarketingExpense: [],
    hasTimeEvolution: [],
    hasOffer: [],
    hasProposition: [],
    hasPastVisit: [],
    hasPlannedVisit: [],
    hasCommunication: [],
    customAttribute: [],
    customAttributeUsable: [],
    frequency: [],
    dateRange: [],
    contactRestrictLocation: [],
    homePage: [],
    menuDisplay: [],
    contactTitle: [],
    contactGreeting: [],
    nationality: [],
    maritalStatus: [],
    children: [],
    pipelineStage: [],
    socialMedia: [],
    offerStatus: [],
    offerConfidence: [],
    currency: [],
    sellType: [],
    accountType: [],
    propertyContractContactType: [],
    propertyContractStep: [],
    propertyContractCommissionType: [],
    propertyContractSellType: [],
    reminderAt: [],
    agenda: [],
    transactionType: [],
    media: [],
    websiteLayout: [],
    websiteTemplate: [],
    suggestionStatusIds: [],
    suggestionTagIds: [],
    suggestionVoteIds: [],
    isActive01: [],
    processStatusIds: [],
    processTypeIds: [],
  },
  feature: {
    task: false,
    reporting: false,
    emailing: false,
    promotion: false,
    lead: false,
    marketingExpense: false,
    matchingGlobal: false,
    history: false,
    mailbox: false,
    agenda: false,
    mls: false,
    fisher: false,
    mortgage: false,
    cyborg: false,
    polygons: false,
    sendEmailOnBehalf: false,
    contract: false,
    sector: false,
    customAttribute: false,
    matchingMargin: false,
    calendarExport: false,
    restriction: false,
    suggestion: false,
  },
  featureAccount: {
    accountTypeMapping: {},
    privilegeMapping: {},
    editableMapping: {},
  },
  featurePrice: {
    frequency: {},
  },
  featureProperty: {
    listDefaultStatusId: [],
  },
  featureLead: {
    listDefaultStatusId: [],
  },
  featureTask: {
    listDefaultStatusId: '',
    isAgendaEnabled: false,
  },
  featureMatching: {
    emailTemplate: {},
    emailContent: {},
    emailBrochureType: {},
    emailBrochurePrivacy: {},
  },
  featureReporting: {
    listDefaultProcessStatusId: [],
  },
  featurePromotion: {},
  featureFisher: {
    categoryIdFloorRequired: [],
  },
  featureContact: {},
  featureReport: {
    listDefaultPropertyTypeId: '',
    isSchedulerEnabled: false,
  },
  featureEmailSent: {},
  featureBrochure: {
    defaultBrochureTypeId: '',
    mapping: {
      privacyIdToPrivacyType: {},
      brochureIdToBrochureType: {},
      brochureIdToPrivacyIds: {},
    },
  },
  featureRestriction: {
    rules: {},
  },
  featurePortal: {
    agencyWebsiteGatewayIds: [],
  },
};
