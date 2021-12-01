/**
 * Each page's tab has a unique ID (UID)
 */
export const enum PageTabEnum {

  // Agency preference
  agencyPreferenceReadInformation = 'agency-preference-read-information',
  agencyPreferenceWriteRequired = 'agency-preference-write-required',

  // Contact
  contactReadProfile = 'contact-read-profile',
  contactWriteProfile = 'contact-write-profile',
  contactWriteDocument = 'contact-write-document',

  // Email
  emailReadInformation = 'email-read-information',
  emailWriteRequired = 'email-write-required',

  // Lead
  leadReadGeneral = 'lead-read-general',
  leadReadEmail = 'lead-read-email',
  leadWriteGeneral = 'lead-write-general',
  leadWriteContactValidation = 'lead-write-contact-validation',

  // Marketing expense
  marketingExpenseReadGeneral = 'marketing-expense-read-general',
  marketingExpenseWriteGeneral = 'marketing-expense-write-general',

  // Matching
  matchingReadInformation = 'matching-read-information',
  matchingWriteRequired = 'matching-write-required',

  // Matching group
  matchingGroupReadInformation = 'matching-group-read-information',
  matchingGroupWriteRequired = 'matching-group-write-required',

  // Promotion
  promotionReadInformation = 'promotion-read-information',
  promotionWriteRequired = 'promotion-write-required',

  // Property
  propertyReadInformation = 'property-read-information',
  propertyWriteRequired = 'property-write-required',

  // Report
  reportReadInformation = 'report-read-information',
  reportWriteRequired = 'report-write-required',

  // Reporting (scheduler)
  reportingReadInformation = 'reporting-read-information',
  reportingWriteRequired = 'reporting-write-required',

  // Sector
  sectorReadInformation = 'sector-read-information',
  sectorReadPropertySale = 'sector-read-property-sale',
  sectorReadPropertyRent = 'sector-read-property-rent',
  sectorWriteRequired = 'sector-write-required',

  // Restriction
  restrictionReadInformation = 'restriction-read-information',
  restrictionWriteRequired = 'restriction-write-required',

  // Task
  taskReadGeneral = 'task-read-general',
  taskWriteGeneral = 'task-write-general',

  // Portal
  portalReadInformation = 'portal-read-information',
  portalReadOutput = 'portal-read-output',
  portalWriteRequired = 'portal-write-required',
  portalWriteContact = 'portal-write-contact',
  portalWriteTechnical = 'portal-write-technical',
  portalWriteSettings = 'portal-write-settings',

  // Custom attribute
  customAttributeReadInformation = 'custom-attribute-read-information',
  customAttributeReadPropertySale = 'custom-attribute-read-property-sale',
  customAttributeReadPropertyRent = 'custom-attribute-read-property-rent',
  customAttributeReadPromotion = 'custom-attribute-read-promotion',
  customAttributeReadContact = 'custom-attribute-read-contact',
  customAttributeWriteRequired = 'custom-attribute-write-required',

  // Email Template
  emailTemplateReadInformation = 'email-template-read-information',
  emailTemplateReadContent = 'email-template-read-content',
  emailTemplateWriteRequired = 'email-template-write-required',
  emailTemplateWriteContent = 'email-template-write-content',

  // Contract
  contractReadGeneral = 'contract-read-general',
  contractReadDeal = 'contract-read-deal',
  contractWriteGeneral = 'contract-write-general',
  contractWriteDeal = 'contract-write-deal',

  // Website
  websiteReadGeneral = 'website-read-general',
  websiteReadStyle = 'website-read-style',
  websiteReadPhoto = 'website-read-photo',
  websiteReadContent = 'website-read-content',
  websiteWriteGeneral = 'website-write-general',
  websiteWriteStyle = 'website-write-style',
  websiteWritePhoto = 'website-write-photo',
  websiteWriteContent = 'website-write-content',

  // Website article
  websiteArticleReadGeneral = 'website-article-read-general',
  websiteArticleReadContent = 'website-article-read-content',
  websiteArticleWriteGeneral = 'website-article-write-general',
  websiteArticleWriteContent = 'website-article-write-content',

  // Suggestion
  suggestionReadInformation = 'suggestion-read-information',
  suggestionReadVote = 'suggestion-read-vote',
  suggestionWriteRequired = 'suggestion-write-required',

  // Emailing
  emailingWriteGeneral = 'emailing-write-general',
  emailingWritePreview = 'emailing-write-preview',

  // Agency profile
  agencyProfileReadProfile = 'agency-profile-read-profile',
  agencyProfileReadImage = 'agency-profile-read-image',
  agencyProfileReadDocument = 'agency-profile-read-document',
  agencyProfileWriteProfile = 'agency-profile-write-profile',
  agencyProfileWriteImage = 'agency-profile-write-image',
  agencyProfileWriteDocument = 'agency-profile-write-document',

  // MLS
  mlsReadOverview = 'mls-read-overview',
  mlsReadAgencies = 'mls-read-agencies',
  mlsWriteOverview = 'mls-write-overview',

  // Production
  productionReadSaleYearly = 'production-read-sale-yearly',
  productionReadSaleMonthly = 'production-read-sale-monthly',
  productionReadRentalYearly = 'production-read-rental-yearly',
  productionReadRentalMonthly = 'production-read-rental-monthly',
  productionWriteSaleYearly = 'production-write-sale-yearly',
  productionWriteSaleMonthly = 'production-write-sale-monthly',
  productionWriteRentalYearly = 'production-write-rental-yearly',
  productionWriteRentalMonthly = 'production-write-rental-monthly',

  // Account
  accountReadInformation = 'account-read-information',
  accountWriteRequired = 'account-write-required',

  // User
  userWriteContact = 'user-write-contact',
  userWriteDocument = 'user-write-document',
  userWriteAccount = 'user-write-account',

  // Process
  processReadLogs = 'process-read-logs',
}
