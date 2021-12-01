import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { HelperService } from './shared/helper.service';
import { ConfirmService } from './shared/confirm.service';
import { BrowserService } from './shared/browser/browser.service';
import { BrowserServiceFactory } from './shared/browser/browser-service.factory';
import { LocalStorageService } from './shared/storage/local-storage.service';
import { LocalStorageServiceFactory } from './shared/storage/local-storage-service.factory';
import { SessionStorageService } from './shared/storage/session-storage.service';
import { SessionStorageServiceFactory } from './shared/storage/session-storage-service.factory';
import { TrackerService } from './shared/tracker/tracker.service';
import { TrackerServiceFactory } from './shared/tracker/tracker-service.factory';
import { AutocompleteService } from './shared/autocomplete.service';
import { PropertyConfig } from './shared/property/property.config';
import { PropertyService } from './shared/property/property.service';
import { PropertySearchlistService } from './shared/property/property-searchlist.service';
import { LeadService } from './shared/lead/lead.service';
import { LeadSearchlistService } from './shared/lead/lead-searchlist.service';
import { MatchingGroupSearchlistService } from './shared/matching-group/matching-group-searchlist.service';
import { ReportingService } from './shared/reporting/reporting.service';
import { ReportingSearchlistService } from './shared/reporting/reporting-searchlist.service';
import { LegacyService } from './shared/legacy.service';
import { PromotionService } from './shared/promotion/promotion.service';
import { PromotionSearchlistService } from './shared/promotion/promotion-searchlist.service';
import { AgencyPreferenceService } from './shared/agency-preference/agency-preference.service';
import { UserService } from './shared/user/user.service';
import { TaskService } from './shared/task/task.service';
import { TaskSearchlistService } from './shared/task/task-searchlist.service';
import { ContactService } from './shared/contact/contact.service';
import { ContactSearchlistService } from './shared/contact/contact-searchlist.service';
import { ContactConfig } from './shared/contact/contact.config';
import { MatchingSearchlistService } from './shared/matching/matching-searchlist.service';
import { MatchingService } from './shared/matching/matching.service';
import { SectorService } from './shared/sector/sector.service';
import { SectorSearchlistService } from './shared/sector/sector-searchlist.service';
import { HistoryService } from './shared/history/history.service';
import { ReportService } from './shared/report/report.service';
import { ReportSearchlistService } from './shared/report/report-searchlist.service';
import { AgencyPreferencePageService } from './shared/agency-preference/agency-preference-page.service';
import { MatchingPageService } from './shared/matching/matching-page.service';
import { MatchingGroupPageService } from './shared/matching-group/matching-group-page.service';
import { ReportingPageService } from './shared/reporting/reporting-page.service';
import { ReportPageService } from './shared/report/report-page.service';
import { SectorPageService } from './shared/sector/sector-page.service';
import { LeadPageService } from './shared/lead/lead-page.service';
import { PromotionPageService } from './shared/promotion/promotion-page.service';
import { PropertyPageService } from './shared/property/property-page.service';
import { TaskPageService } from './shared/task/task-page.service';
import { AgencyPreferenceConfig } from './shared/agency-preference/agency-preference.config';
import { LeadConfig } from './shared/lead/lead.config';
import { MatchingConfig } from './shared/matching/matching.config';
import { MatchingGroupConfig } from './shared/matching-group/matching-group.config';
import { PromotionConfig } from './shared/promotion/promotion.config';
import { ReportConfig } from './shared/report/report.config';
import { SectorConfig } from './shared/sector/sector.config';
import { TaskConfig } from './shared/task/task.config';
import { MarketingExpenseConfig } from './shared/marketing-expense/marketing-expense.config';
import { ReportingConfig } from './shared/reporting/reporting.config';
import { ContactPageService } from './shared/contact/contact-page.service';
import { MarketingExpensePageService } from './shared/marketing-expense/marketing-expense-page.service';
import { MarketingExpenseSearchlistService } from './shared/marketing-expense/marketing-expense-searchlist.service';
import { EmailConfig } from './shared/email/email.config';
import { EmailPageService } from './shared/email/email-page.service';
import { EmailService } from './shared/email/email.service';
import { EmailSearchlistService } from './shared/email/email-searchlist.service';
import { FormModelAdapterStrategy } from './shared/form/form-model-adapter.strategy';
import { MatchingGroupService } from './shared/matching-group/matching-group.service';
import { MarketingExpenseService } from './shared/marketing-expense/marketing-expense.service';
import { PortalConfig } from './shared/portal/portal.config';
import { PortalService } from './shared/portal/portal.service';
import { PortalSearchlistService } from './shared/portal/portal-searchlist.service';
import { PortalPageService } from './shared/portal/portal-page-service';
import { PortalModelContactAdapterStrategy } from './shared/portal/portal-model-contact-adapter.strategy';
import { PortalModelRequiredAdapterStrategy } from './shared/portal/portal-model-required-adapter.strategy';
import { PortalModelTechnicalAdapterStrategy } from './shared/portal/portal-model-technical-adapter.strategy';
import { PortalModelSettingsAdapterStrategy } from './shared/portal/portal-model-settings-adapter.strategy';
import { DeviceConfig } from './shared/device/device.config';
import { DeviceService } from './shared/device/device.service';
import { DeviceSearchlistService } from './shared/device/device-searchlist.service';
import { DevicePageService } from './shared/device/device-page-service';
import { FormService } from './shared/form.service';
import { SectorModelAdapterStrategy } from './shared/sector/sector-model-adapter.strategy';
import { CanDeactivateRouteGuard } from './shared/can-deactivate.route-guard';
import { CustomAttributeConfig } from './shared/custom-attribute/custom-attribute.config';
import { CustomAttributePageService } from './shared/custom-attribute/custom-attribute-page.service';
import { CustomAttributeService } from './shared/custom-attribute/custom-attribute.service';
import { CustomAttributeSearchlistService } from './shared/custom-attribute/custom-attribute-searchlist.service';
import { CustomAttributeModelAdapterStrategy } from './shared/custom-attribute/custom-attribute-model-adapter.strategy';
import { DnsPageService } from './shared/dns/dns-page.service';
import { DnsSearchlistService } from './shared/dns/dns-searchlist.service';
import { DnsConfig } from './shared/dns/dns.config';
import { DnsService } from './shared/dns/dns.service';
import { ReportGenerationModelAdapterStrategy } from './shared/report/report-generation-model-adapter.strategy';
import { EmailTemplatePageService } from './shared/email-template/email-template-page.service';
import { EmailTemplateSearchlistService } from './shared/email-template/email-template-searchlist.service';
import { EmailTemplateConfig } from './shared/email-template/email-template.config';
import { EmailTemplateService } from './shared/email-template/email-template.service';
import { ContractConfig } from './shared/contract/contract.config';
import { ContractPageService } from './shared/contract/contract-page.service';
import { ContractService } from './shared/contract/contract.service';
import { ContractSearchlistService } from './shared/contract/contract-searchlist.service';
import { EmailTemplateModelRequiredAdapterStrategy } from './shared/email-template/email-template-model-required-adapter.strategy';
import { EmailTemplateModelContentAdapterStrategy } from './shared/email-template/email-template-model-content-adapter.strategy';
import { LocationService } from './shared/location/location.service';
import { AgencyConfig } from './shared/agency/agency.config';
import { AgencyService } from './shared/agency/agency.service';
import { AgencyPageService } from './shared/agency/agency-page.service';
import { UploadService } from './shared/upload.service';
import { ContactDocumentService } from './shared/contact/contact-document.service';
import { ContactModelAdapterStrategy } from './shared/contact/contact-model-adapter.strategy';
import { WebsiteConfig } from './shared/website/website.config';
import { WebsitePageService } from './shared/website/website-page.service';
import { WebsiteService } from './shared/website/website.service';
import { WebsiteSearchlistService } from './shared/website/website-searchlist.service';
import { ContractModelGeneralAdapterStrategy } from './shared/contract/contract-model-general-adapter.strategy';
import { ContractModelDealAdapterStrategy } from './shared/contract/contract-model-deal-adapter.strategy';
import { AuthenticationService } from './shared/authentication/authentication.service';
import { RestrictionConfig } from './shared/restriction/restriction.config';
import { RestrictionPageService } from './shared/restriction/restriction-page.service';
import { RestrictionModelAdapterStrategy } from './shared/restriction/restriction-model-adapter.strategy';
import { RestrictionSearchlistService } from './shared/restriction/restriction-searchlist.service';
import { RestrictionService } from './shared/restriction/restriction.service';
import { AccountService } from './shared/account/account.service';
import { TaskModelGeneralAdapterStrategy } from './shared/task/task-model-general-adapter.strategy';
import { SuggestionConfig } from './shared/suggestion/suggestion.config';
import { SuggestionPageService } from './shared/suggestion/suggestion-page.service';
import { SuggestionService } from './shared/suggestion/suggestion.service';
import { SuggestionSearchlistService } from './shared/suggestion/suggestion-searchlist.service';
import { SuggestionModelAdapterStrategy } from './shared/suggestion/suggestion-model-adapter.strategy';
import { HelpService } from './shared/help/help.service';
import { EmailingModelGeneralAdapterStrategy } from './shared/emailing/emailing-model-general-adapter.strategy';
import { EmailingService } from './shared/emailing/emailing.service';
import { EmailingPageService } from './shared/emailing/emailing-page.service';
import { EmailingConfig } from './shared/emailing/emailing.config';
import { EmailingModelContentAdapterStrategy } from './shared/emailing/emailing-model-content-adapter.strategy';
import { EmailingDocumentService } from './shared/emailing/emailing-document.service';
import { HelpConfig } from './shared/help/help.config';
import { HelpPageService } from './shared/help/help-page.service';
import { LeadModelGeneralAdapterStrategy } from './shared/lead/lead-model-general-adapter.strategy';
import { LeadModelValidationAdapterStrategy } from './shared/lead/lead-model-validation-adapter.strategy';
import { WebsiteModelGeneralAdapterStrategy } from './shared/website/website-model-general-adapter.strategy';
import { WebsiteDocumentService } from './shared/website/website-document.service';
import { WebsiteModelContentAdapterStrategy } from './shared/website/website-model-content-adapter.strategy';
import { WebsiteModelStyleAdapterStrategy } from './shared/website/website-model-style-adapter.strategy';
import { WebsiteArticleConfig } from './shared/website-article/website-article.config';
import { WebsiteArticlePageService } from './shared/website-article/website-article-page.service';
import { WebsiteArticleService } from './shared/website-article/website-article.service';
import { WebsiteArticleSearchlistService } from './shared/website-article/website-article-searchlist.service';
import { WebsiteArticleDocumentService } from './shared/website-article/website-article-document.service';
import { WebsiteArticleModelGeneralAdapterStrategy } from './shared/website-article/website-article-model-general-adapter.strategy';
import { WebsiteArticleModelContentAdapterStrategy } from './shared/website-article/website-article-model-content-adapter.strategy';
import { MarketingExpenseModelGeneralAdapterStrategy } from './shared/marketing-expense/marketing-expense-model-general-adapter.strategy';
import { AgencyBackupConfig } from './shared/agency-backup/agency-backup.config';
import { AgencyBackupPageService } from './shared/agency-backup/agency-backup-page.service';
import { AgencyBackupService } from './shared/agency-backup/agency-backup.service';
import { AgencyProfileConfig } from './shared/agency-profile/agency-profile.config';
import { AgencyProfilePageService } from './shared/agency-profile/agency-profile-page.service';
import { AgencyProfileService } from './shared/agency-profile/agency-profile.service';
import { AgencyProfileGeneralDocumentService } from './shared/agency-profile/agency-profile-general-document.service';
import { AgencyProfileImageDocumentService } from './shared/agency-profile/agency-profile-image-document.service';
import { AgencyProfileModelProfileAdapterStrategy } from './shared/agency-profile/agency-profile-model-profile-adapter.strategy';
import { AgencyProfileModelImagesAdapterStrategy } from './shared/agency-profile/agency-profile-model-images-adapter.strategy';
import { AgendaConfig } from './shared/agenda/agenda.config';
import { AgendaPageService } from './shared/agenda/agenda-page.service';
import { AgendaService } from './shared/agenda/agenda.service';
import { AgendaModelRequiredAdapterStrategy } from './shared/agenda/agenda-model-required-adapter.strategy';
import { MlsConfig } from './shared/mls/mls.config';
import { MlsPageService } from './shared/mls/mls-page.service';
import { MlsService } from './shared/mls/mls.service';
import { MlsSearchlistService } from './shared/mls/mls-searchlist.service';
import { MlsModelAdapterStrategy } from './shared/mls/mls-model-adapter.strategy';
import { RouterService } from './shared/router/router.service';
import { ProductionConfig } from './shared/production/production.config';
import { ProductionPageService } from './shared/production/production-page.service';
import { ProductionService } from './shared/production/production.service';
import { ProductionModelTypeAdapterStrategy } from './shared/production/production-model-type-adapter.strategy';
import { AccountConfig } from './shared/account/account.config';
import { AccountSearchlistService } from './shared/account/account-searchlist.service';
import { AccountPageService } from './shared/account/account-page.service';
import { AccountModelAdapterStrategy } from './shared/account/account-model-adapter.strategy';
import { UserConfig } from './shared/user/user.config';
import { UserPageService } from './shared/user/user-page.service';
import { UserDocumentService } from './shared/user/user-document.service';
import { ProcessConfig } from './shared/process/process.config';
import { ProcessPageService } from './shared/process/process-page.service';
import { ProcessService } from './shared/process/process.service';
import { ProcessSearchlistService } from './shared/process/process-searchlist.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
})
export class CoreModule {

  /**
   * Constructor
   */
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {

    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only.');
    }
  }

  /**
   * Return providers for root usage only
   */
  static forRoot(): ModuleWithProviders {

    return {
      ngModule: CoreModule,
      providers: [
        HelperService,
        ConfirmService,
        FormService,
        AutocompleteService,
        UploadService,
        FormModelAdapterStrategy,
        { provide: BrowserService, useFactory: BrowserServiceFactory },
        { provide: LocalStorageService, useFactory: LocalStorageServiceFactory, deps: [BrowserService] },
        { provide: SessionStorageService, useFactory: SessionStorageServiceFactory, deps: [BrowserService] },
        { provide: TrackerService, useFactory: TrackerServiceFactory, deps: [BrowserService] },
        CanDeactivateRouteGuard,
        RouterService,

        // Authentication
        AuthenticationService,

        // Legacy
        LegacyService,

        // Account
        AccountService,

        // User
        UserService,

        // History
        HistoryService,

        // Property
        PropertyConfig,
        PropertyPageService,
        PropertyService,
        PropertySearchlistService,

        // Lead
        LeadConfig,
        LeadPageService,
        LeadService,
        LeadSearchlistService,
        LeadModelGeneralAdapterStrategy,
        LeadModelValidationAdapterStrategy,

        // Matching
        MatchingConfig,
        MatchingPageService,
        MatchingSearchlistService,
        MatchingService,

        // Matching group
        MatchingGroupConfig,
        MatchingGroupPageService,
        MatchingGroupSearchlistService,
        MatchingGroupService,

        // Reporting
        ReportingConfig,
        ReportingPageService,
        ReportingService,
        ReportingSearchlistService,

        // Promotion
        PromotionConfig,
        PromotionPageService,
        PromotionService,
        PromotionSearchlistService,

        // Agency preference
        AgencyPreferenceConfig,
        AgencyPreferenceService,
        AgencyPreferencePageService,

        // Agency
        AgencyConfig,
        AgencyService,
        AgencyPageService,

        // Task
        TaskConfig,
        TaskPageService,
        TaskService,
        TaskSearchlistService,
        TaskModelGeneralAdapterStrategy,

        // Contact
        ContactConfig,
        ContactPageService,
        ContactService,
        ContactSearchlistService,
        ContactDocumentService,
        ContactModelAdapterStrategy,

        // Sector
        SectorConfig,
        SectorPageService,
        SectorService,
        SectorSearchlistService,
        SectorModelAdapterStrategy,

        // Location
        LocationService,

        // Report
        ReportConfig,
        ReportPageService,
        ReportService,
        ReportSearchlistService,
        ReportGenerationModelAdapterStrategy,

        // Marketing Expense
        MarketingExpenseConfig,
        MarketingExpensePageService,
        MarketingExpenseSearchlistService,
        MarketingExpenseService,
        MarketingExpenseModelGeneralAdapterStrategy,

        // Email
        EmailConfig,
        EmailPageService,
        EmailService,
        EmailSearchlistService,

        // Portal
        PortalConfig,
        PortalPageService,
        PortalService,
        PortalSearchlistService,
        PortalModelContactAdapterStrategy,
        PortalModelRequiredAdapterStrategy,
        PortalModelTechnicalAdapterStrategy,
        PortalModelSettingsAdapterStrategy,

        // Device
        DeviceConfig,
        DevicePageService,
        DeviceService,
        DeviceSearchlistService,

        // Custom attribute
        CustomAttributeConfig,
        CustomAttributePageService,
        CustomAttributeService,
        CustomAttributeSearchlistService,
        CustomAttributeModelAdapterStrategy,

        // Dns
        DnsConfig,
        DnsPageService,
        DnsService,
        DnsSearchlistService,

        // Email template
        EmailTemplateConfig,
        EmailTemplatePageService,
        EmailTemplateService,
        EmailTemplateSearchlistService,
        EmailTemplateModelRequiredAdapterStrategy,
        EmailTemplateModelContentAdapterStrategy,

        // Emailing
        EmailingConfig,
        EmailingPageService,
        EmailingService,
        EmailingDocumentService,
        EmailingModelGeneralAdapterStrategy,
        EmailingModelContentAdapterStrategy,

        // Contract
        ContractConfig,
        ContractPageService,
        ContractService,
        ContractSearchlistService,
        ContractModelGeneralAdapterStrategy,
        ContractModelDealAdapterStrategy,

        // Website
        WebsiteConfig,
        WebsitePageService,
        WebsiteService,
        WebsiteSearchlistService,
        WebsiteDocumentService,
        WebsiteModelGeneralAdapterStrategy,
        WebsiteModelStyleAdapterStrategy,
        WebsiteModelContentAdapterStrategy,

        // Website article
        WebsiteArticleConfig,
        WebsiteArticlePageService,
        WebsiteArticleService,
        WebsiteArticleSearchlistService,
        WebsiteArticleDocumentService,
        WebsiteArticleModelGeneralAdapterStrategy,
        WebsiteArticleModelContentAdapterStrategy,

        // Restriction
        RestrictionConfig,
        RestrictionPageService,
        RestrictionService,
        RestrictionSearchlistService,
        RestrictionModelAdapterStrategy,

        // Suggestion
        SuggestionConfig,
        SuggestionPageService,
        SuggestionService,
        SuggestionSearchlistService,
        SuggestionModelAdapterStrategy,

        // Help
        HelpConfig,
        HelpPageService,
        HelpService,

        // Agency backup
        AgencyBackupConfig,
        AgencyBackupPageService,
        AgencyBackupService,

        // Agency profile
        AgencyProfileConfig,
        AgencyProfilePageService,
        AgencyProfileService,
        AgencyProfileGeneralDocumentService,
        AgencyProfileImageDocumentService,
        AgencyProfileModelProfileAdapterStrategy,
        AgencyProfileModelImagesAdapterStrategy,

        // Agenda
        AgendaConfig,
        AgendaPageService,
        AgendaService,
        AgendaModelRequiredAdapterStrategy,

        // MLS
        MlsConfig,
        MlsPageService,
        MlsService,
        MlsSearchlistService,
        MlsModelAdapterStrategy,

        // Production
        ProductionConfig,
        ProductionPageService,
        ProductionService,
        ProductionModelTypeAdapterStrategy,

        // Account
        AccountConfig,
        AccountPageService,
        AccountService,
        AccountSearchlistService,
        AccountModelAdapterStrategy,

        // User
        UserConfig,
        UserPageService,
        UserService,
        UserDocumentService,

        // Process
        ProcessConfig,
        ProcessPageService,
        ProcessService,
        ProcessSearchlistService,
      ],
    };
  }
}
