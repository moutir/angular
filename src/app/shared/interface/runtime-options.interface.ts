import { OptionInterface } from './option.interface';
import { OptionGroupInterface } from './option-group.interface';
import { RuntimeAgencyPreferenceOptionInterface } from './runtime-agency-preference-option.interface';
import { OptionGroupCustomAttributeInterface } from './option-group-custom-attribute.interface';
import { OptionOfOptionsInterface } from './option-of-options.interface';

export interface RuntimeOptionsInterface {

  // List of property types
  propertyType: OptionInterface[];

  // List of property categories
  propertyCategory: OptionInterface[];

  // List of property sub categories
  propertySubCategory: OptionInterface[];

  // List of property status
  propertyStatus: OptionInterface[];

  // List of sell prices
  priceSell: OptionInterface[];

  // List of rent prices
  priceRent: OptionInterface[];

  // List of rooms
  room: OptionInterface[];

  // List of bedrooms
  bedroom: OptionInterface[];

  // List of living areas
  livingArea: OptionInterface[];

  // List of land areas
  landArea: OptionInterface[];

  // List of positions
  position: OptionInterface[];

  // List of views
  view: OptionInterface[];

  // List of publication statuses
  publicationStatus: OptionInterface[];

  // List of publication on websites
  publicationWebsite: OptionInterface[];

  // List of publication on gateways
  publicationGateway: OptionInterface[];

  // List of visibilities
  visibility: OptionInterface[];

  // List of sell brokers
  brokerSell: OptionInterface[];

  // List of rent brokers
  brokerRent: OptionInterface[];

  // List of colleague brokers
  brokerColleague: OptionInterface[];

  // List of brokers per agency
  brokerByAgency: OptionGroupInterface[];

  // List of sale brokers per agency
  brokerSellByAgency: OptionGroupInterface[];

  // List of rental brokers per agency
  brokerRentByAgency: OptionGroupInterface[];

  // List of related agencies
  agencyRelated: OptionInterface[];

  // User's agency
  agencyUser: OptionInterface;

  // List of agencies from MLS
  agencyMls: OptionInterface[];

  // List of agencies from the group of agencies
  agencyGroup: OptionInterface[];

  // Group agency (all) option
  agencyGroupAll: OptionInterface;

  // Mls agency (all) option
  agencyMlsAll: OptionInterface;

  // List of group of agencies
  groupOfAgency: OptionInterface[];

  // List of yes/no for direct transactions
  isDirectTransaction01: OptionInterface[];

  // List of yes/no for promotion
  isPromotion01: OptionInterface[];

  // List of yes/no for selling to foreigner
  isSellToForeigner01: OptionInterface[];

  // List of rankings
  ranking: OptionInterface[];

  // List of matching group entities
  matchingGroupEntity: OptionInterface[];

  // List of matching group types
  matchingGroupType: OptionInterface[];

  // List of matching process methods
  matchingProcessMethod: OptionInterface[];

  // List of matching status
  matchingStatus: OptionInterface[];

  // List of email templates
  emailTemplate: OptionInterface[];

  // List of email contents per source
  emailContent: OptionGroupInterface[];

  // List of brochure qualities
  brochureQuality: OptionInterface[];

  // List of brochure privacy rules
  brochurePrivacy: OptionInterface[];

  // List of communication languages
  languageCommunication: OptionInterface[];

  // List of reporting process statuses
  reportingStatus: OptionInterface[];

  // List of reporting types
  reportingType: OptionInterface[];

  // List of lead types
  leadType: OptionInterface[];

  // List of lead brokers
  leadBroker: OptionInterface[];

  // List of lead statuses
  leadStatus: OptionInterface[];

  // List of lead sources
  leadSource: OptionInterface[];

  // List of countries by id
  countryById: OptionInterface[];

  // List of countries by country code
  countryByCode: OptionInterface[];

  // List of motivations
  motivation: OptionInterface[];

  // List of promotion status
  promotionStatus: OptionInterface[];

  // Agency preference options
  agencyPreference: RuntimeAgencyPreferenceOptionInterface[];

  // List of task types
  taskType: OptionInterface[];

  // List of promotion status
  taskStatus: OptionInterface[];

  // List of contact modes
  contactMode: OptionInterface[];

  // List of contact types
  contactType: OptionOfOptionsInterface[];

  // List of yes/no for direct client
  isDirectClient01: OptionInterface[];

  // List of transactions
  transaction: OptionInterface[];

  // List of yes/no for vip
  isVip01: OptionInterface[];

  // List of contact searches
  contactSearch: OptionInterface[];

  // List of contact search types
  contactSearchType: OptionInterface[];

  // List of last contact options
  lastContact: OptionInterface[];

  // List of areas
  area: OptionInterface[];

  // List of contact origins
  contactOrigin: OptionOfOptionsInterface[];

  // List of spaces
  space: OptionInterface[];

  // List of property brochure types
  propertyBrochureType: OptionInterface[];

  // List of promotion brochure types
  promotionBrochureType: OptionInterface[];

  // List of yes/no for archive
  isArchive01: OptionInterface[];

  // List of report types
  reportType: OptionInterface[];

  // List of report property types
  reportPropertyType: OptionInterface[];

  // List of report schedule types
  reportScheduleType: OptionInterface[];

  // List of owner report brochure types
  reportOwnerBrochureType: OptionInterface[];

  // List of buyer, tenant and intermediary reports brochure types
  reportOtherBrochureType: OptionInterface[];

  // List of developer report brochure types
  reportDeveloperBrochureType: OptionInterface[];

  // List of email statuses
  emailStatus: OptionInterface[];

  // List of email attachment types
  emailAttachmentType: OptionInterface[];

  // List of contact special types
  contactSpecialType: OptionInterface[];

  // List of device types
  deviceType: OptionInterface[];

  // List of agency users
  agencyUsers: OptionInterface[];

  // List of portal publication languages
  portalLanguage: OptionInterface[];

  // List of yes/no for broker
  hasBroker: OptionInterface[];

  // List of yes/no for information
  hasInformation: OptionInterface[];

  // List of yes/no for price
  hasPrice: OptionInterface[];

  // List of yes/no for lead
  hasLead: OptionInterface[];

  // List of yes/no for summary
  hasSummary: OptionInterface[];

  // List of yes/no for marketing expense
  hasMarketingExpense: OptionInterface[];

  // List of yes/no for time evolution
  hasTimeEvolution: OptionInterface[];

  // List of yes/no for offer
  hasOffer: OptionInterface[];

  // List of yes/no for proposition
  hasProposition: OptionInterface[];

  // List of yes/no for past visit
  hasPastVisit: OptionInterface[];

  // List of yes/no for planned visit
  hasPlannedVisit: OptionInterface[];

  // List of yes/no for communication
  hasCommunication: OptionInterface[];

  // List of custom attributes
  customAttribute: OptionGroupCustomAttributeInterface[];

  // List of custom attribute usables
  customAttributeUsable: OptionInterface[];

  // List of sectors
  sector: OptionInterface[];

  // List of send lead copy options
  portalSendLeadCopy: OptionInterface[];

  // Portal(gateway) list
  portalList: OptionInterface[];

  // List of frequencies
  frequency: OptionInterface[];

  // List of date ranges
  dateRange: OptionInterface[];

  // List of property contract contact types
  propertyContractContactType: OptionInterface[];

  // List of property contract steps
  propertyContractStep: OptionInterface[];

  // List of property contract commission types
  propertyContractCommissionType: OptionInterface[];

  // List of property contract sell types
  propertyContractSellType: OptionInterface[];

  // List of contact restrict location options
  contactRestrictLocation: OptionInterface[];

  // List of home page options
  homePage: OptionInterface[];

  // List of menu display types
  menuDisplay: OptionInterface[];

  // List of contact titles
  contactTitle: OptionInterface[];

  // List of contact greetings
  contactGreeting: OptionInterface[];

  // List of nationalities
  nationality: OptionInterface[];

  // List of marital statuses
  maritalStatus: OptionInterface[];

  // List of children
  children: OptionInterface[];

  // List of pipeline stages
  pipelineStage: OptionInterface[];

  // List of social medias
  socialMedia: OptionInterface[];

  // List of offer status
  offerStatus: OptionInterface[];

  // List of offer confidence
  offerConfidence: OptionInterface[];

  // List of currencies
  currency: OptionInterface[];

  // List of sell types
  sellType: OptionInterface[];

  // List of account types
  accountType: OptionInterface[];

  // List of reminder time options
  reminderAt: OptionInterface[];

  // List of agendas
  agenda: OptionInterface[];

  // List of transaction types
  transactionType: OptionInterface[];

  // List of medias
  media: OptionInterface[];

  // List of website layouts
  websiteLayout: OptionInterface[];

  // List of website templates
  websiteTemplate: OptionInterface[];

  // List of suggestion statuses
  suggestionStatusIds: OptionInterface[];

  // List of suggestion tags
  suggestionTagIds: OptionInterface[];

  // List of suggestion votes
  suggestionVoteIds: OptionInterface[];

  // List of active/inactive
  isActive01: OptionInterface[];

  // List of process statuses
  processStatusIds: OptionInterface[];

  // List of process types
  processTypeIds: OptionInterface[];

  // List of circles
  circle: OptionInterface[];
}
