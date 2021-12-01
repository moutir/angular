import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AutocompleteApiService } from './shared/autocomplete/autocomplete-api.service';
import { CountApiService } from './shared/count/count-api.service';
import { PhalconHttpService } from './http/phalcon-http.service';
import { EmailApiService } from './shared/email/email-api.service';
import { MatchingApiService } from './shared/matching/matching-api.service';
import { PromotionApiService } from './shared/promotion/promotion-api.service';
import { PropertyApiService } from './shared/property/property-api.service';
import { ReportingApiService } from './shared/reporting/reporting-api.service';
import { RuntimeApiService } from './shared/runtime/runtime-api.service';
import { LeadApiService } from './shared/lead/lead-api.service';
import { AgencyPreferenceApiService } from './shared/agency-preference/agency-preference-api.service';
import { AgencyApiService } from './shared/agency/agency-api.service';
import { UserApiService } from './shared/user/user-api.service';
import { TaskApiService } from './shared/task/task-api.service';
import { HistoryApiService } from './shared/history/history-api.service';
import { SectorApiService } from './shared/sector/sector-api.service';
import { ReportApiService } from './shared/report/report-api.service';
import { MatchingGroupApiService } from './shared/matching-group/matching-group-api.service';
import { MarketingExpenseApiService } from './shared/marketing-expense/marketing-expense-api.service';
import { PortalApiService } from './shared/portal/portal-api.service';
import { DeviceApiService } from './shared/device/device-api.service';
import { CustomAttributeApiService } from './shared/custom-attribute/custom-attribute-api.service';
import { DnsApiService } from './shared/dns/dns-api.service';
import { SymfonyHttpService } from './http/symfony-http.service';
import { EmailTemplateApiService } from './shared/email-template/email-template-api.service';
import { ContactApiPhalconService } from './shared/contact/contact-api-phalcon.service';
import { ContactApiSymfonyService } from './shared/contact/contact-api-symfony.service';
import { UploadApiService } from './shared/upload/upload-api.service';
import { DocumentApiService } from './shared/document/document-api.service';
import { WebsiteApiService } from './shared/website/website-api.service';
import { JsonapiParserService } from './format/jsonapi/jsonapi-parser.service';
import { LegacyParserService } from './format/legacy/legacy-parser.service';
import { JsonapiHttpService } from './format/jsonapi/jsonapi-http-service';
import { CustomAttributeValueApiService } from './shared/custom-attribute-value/custom-attribute-value-api.service';
import { ContractApiService } from './shared/contract/contract-api.service';
import { ContractContactApiService } from './shared/contract-contact/contract-contact-api.service';
import { ContractCommissionApiService } from './shared/contract-commission/contract-commission-api.service';
import { AuthenticationApiSymfonyService } from './shared/authentication/authentication-api-symfony.service';
import { AuthenticationApiPhalconService } from './shared/authentication/authentication-api-phalcon.service';
import { EmailingApiService } from './shared/emailing/emailing-api.service';
import { AccountApiJsonapiService } from './shared/account/account-api-jsonapi.service';
import { RestrictionApiService } from './shared/restriction/restriction-api.service';
import { WebsiteArticleApiService } from './shared/website-article/website-article-api.service';
import { SuggestionApiService } from './shared/suggestion/suggestion-api.service';
import { HelpApiService } from './shared/help/help-api.service';
import { AgencyProfileApiService } from './shared/agency-profile/agency-profile-api.service';
import { AgendaApiService } from './shared/agenda/agenda-api.service';
import { MlsApiService } from './shared/mls/mls-api.service';
import { ProductionApiService } from './shared/production/production-api.service';
import { AccountApiService } from './shared/account/account-api.service';
import { ProcessApiService } from './shared/process/process-api.service';
import { LegacyAgencyHydrator } from './format/legacy/data/legacy-agency.hydrator';
import { LegacyContactHydrator } from './format/legacy/data/legacy-contact.hydrator';
import { LegacyAccountHydrator } from './format/legacy/data/legacy-account.hydrator';
import { LegacyMlsHydrator } from './format/legacy/data/legacy-mls.hydrator';
import { LegacyRestrictionHydrator } from './format/legacy/data/legacy-restriction.hydrator';
import { LegacySuggestionHydrator } from './format/legacy/data/legacy-suggestion.hydrator';
import { LegacyProcessHydrator } from './format/legacy/data/legacy-process.hydrator';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [],
  providers: [

    // Legacy API
    PhalconHttpService,
    LegacyParserService,
    LegacyAgencyHydrator,
    LegacyContactHydrator,
    LegacyAccountHydrator,
    LegacyMlsHydrator,
    LegacyRestrictionHydrator,
    LegacySuggestionHydrator,
    LegacyProcessHydrator,

    // Symfony API
    SymfonyHttpService,
    JsonapiHttpService,
    JsonapiParserService,

    // Services
    AuthenticationApiPhalconService,
    AuthenticationApiSymfonyService,
    AccountApiService,
    AccountApiJsonapiService,
    AutocompleteApiService,
    ContactApiPhalconService,
    ContactApiSymfonyService,
    CountApiService,
    EmailApiService,
    MatchingApiService,
    MatchingGroupApiService,
    PromotionApiService,
    PropertyApiService,
    ReportingApiService,
    LeadApiService,
    RuntimeApiService,
    AgencyPreferenceApiService,
    AgencyApiService,
    UserApiService,
    TaskApiService,
    HistoryApiService,
    SectorApiService,
    ReportApiService,
    MarketingExpenseApiService,
    PortalApiService,
    DeviceApiService,
    CustomAttributeApiService,
    CustomAttributeValueApiService,
    DnsApiService,
    EmailTemplateApiService,
    ContractApiService,
    ContractContactApiService,
    ContractCommissionApiService,
    UploadApiService,
    DocumentApiService,
    WebsiteApiService,
    WebsiteArticleApiService,
    EmailingApiService,
    RestrictionApiService,
    SuggestionApiService,
    HelpApiService,
    AgencyProfileApiService,
    AgendaApiService,
    MlsApiService,
    ProductionApiService,
    ProcessApiService,
  ],
})
export class ApiModule {

}
