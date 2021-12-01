import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '../../environments/environment';
import { DataRuntimeModule } from './data-runtime/data-runtime.module';
import { DataPropertyModule } from './data-property/data-property.module';
import { UiPropertyModule } from './ui-property/ui-property.module';
import { UiSearchlistModule } from './ui-searchlist/ui-searchlist.module';
import { DataSearchlistModule } from './data-searchlist/data-searchlist.module';
import { DataAutocompleteModule } from './data-autocomplete/data-autocomplete.module';
import { UiAutocompleteModule } from './ui-autocomplete/ui-autocomplete.module';
import { UiRuntimeModule } from './ui-runtime/ui-runtime.module';
import { UiEntityModule } from './ui-entity/ui-entity.module';
import { DataContactModule } from './data-contact/data-contact.module';
import { UiContactModule } from './ui-contact/ui-contact.module';
import { DataMatchingGroupModule } from './data-matching-group/data-matching-group.module';
import { UiMatchingGroupModule } from './ui-matching-group/ui-matching-group.module';
import { DataPromotionModule } from './data-promotion/data-promotion.module';
import { UiPromotionModule } from './ui-promotion/ui-promotion.module';
import { DataEmailModule } from './data-email/data-email.module';
import { DataReportingModule } from './data-reporting/data-reporting.module';
import { UiReportingModule } from './ui-reporting/ui-reporting.module';
import { DataLeadModule } from './data-lead/data-lead.module';
import { UiLeadModule } from './ui-lead/ui-lead.module';
import { UiAgencyPreferenceModule } from './ui-agency-preference/ui-agency-preference.module';
import { UiUserModule } from './ui-user/ui-user.module';
import { DataTaskModule } from './data-task/data-task.module';
import { UiTaskModule } from './ui-task/ui-task.module';
import { DataHistoryModule } from './data-history/data-history.module';
import { UiHistoryModule } from './ui-history/ui-history.module';
import { DataMatchingModule } from './data-matching/data-matching.module';
import { UiMatchingModule } from './ui-matching/ui-matching.module';
import { DataSectorModule } from './data-sector/data-sector.module';
import { UiSectorModule } from './ui-sector/ui-sector.module';
import { UiReportModule } from './ui-report/ui-report.module';
import { DataReportModule } from './data-report/data-report.module';
import { UiMarketingExpenseModule } from './ui-marketing-expense/ui-marketing-expense.module';
import { DataMarketingExpenseModule } from './data-marketing-expense/data-marketing-expense.module';
import { UiEmailModule } from './ui-email/ui-email.module';
import { DataPortalModule } from './data-portal/data-portal.module';
import { UiPortalModule } from './ui-portal/ui-portal.module';
import { DataDeviceModule } from './data-device/data-device.module';
import { UiDeviceModule } from './ui-device/ui-device.module';
import { UiPageModule } from './ui-page/ui-page.module';
import { DataAgencyPreferenceModule } from './data-agency-preference/data-agency-preference.module';
import { UiFormModule } from './ui-form/ui-form.module';
import { UiCustomAttributeModule } from './ui-custom-attribute/ui-custom-attribute.module';
import { DataCustomAttributeModule } from './data-custom-attribute/data-custom-attribute.module';
import { DataDnsModule } from './data-dns/data-dns.module';
import { UiDnsModule } from './ui-dns/ui-dns.module';
import { DataEmailTemplateModule } from './data-email-template/data-email-template.module';
import { UiEmailTemplateModule } from './ui-email-template/ui-email-template.module';
import { DataContractModule } from './data-contract/data-contract.module';
import { UiContractModule } from './ui-contract/ui-contract.module';
import { DataAgencyModule } from './data-agency/data-agency.module';
import { UiAgencyModule } from './ui-agency/ui-agency.module';
import { DataUserModule } from './data-user/data-user.module';
import { UiUploadModule } from './ui-upload/ui-upload.module';
import { DataUploadModule } from './data-upload/data-upload.module';
import { DataDocumentModule } from './data-document/data-document.module';
import { UiDocumentModule } from './ui-document/ui-document.module';
import { DataWebsiteModule } from './data-website/data-website.module';
import { UiWebsiteModule } from './ui-website/ui-website.module';
import { UiLayoutModule } from './ui-layout/ui-layout.module';
import { DataAccountModule } from './data-account/data-account.module';
import { UiEmailingModule } from './ui-emailing/ui-emailing.module';
import { UiRestrictionModule } from './ui-restriction/ui-restriction.module';
import { DataRestrictionModule } from './data-restriction/data-restriction.module';
import { DataWebsiteArticleModule } from './data-website-article/data-website-article.module';
import { UiWebsiteArticleModule } from './ui-website-article/ui-website-article.module';
import { DataSuggestionModule } from './data-suggestion/data-suggestion.module';
import { UiSuggestionModule } from './ui-suggestion/ui-suggestion.module';
import { UiGalleryModule } from './ui-gallery/ui-gallery.module';
import { UiHelpModule } from './ui-help/ui-help.module';
import { UiAgencyBackupModule } from './ui-agency-backup/ui-agency-backup.module';
import { UiAgencyProfileModule } from './ui-agency-profile/ui-agency-profile.module';
import { UiAgendaModule } from './ui-agenda/ui-agenda.module';
import { DataMlsModule } from './data-mls/data-mls.module';
import { UiMlsModule } from './ui-mls/ui-mls.module';
import { UiProductionModule } from './ui-production/ui-production.module';
import { DataProductionModule } from './data-production/data-production.module';
import { UiAccountModule } from './ui-account/ui-account.module';
import { UiProcessModule } from './ui-process/ui-process.module';
import { DataProcessModule } from './data-process/data-process.module';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(
      environment.production ? {} : { router: routerReducer },
      { metaReducers: environment.production ? [] : [storeFreeze] },
    ),
    environment.production ? [] : StoreDevtoolsModule.instrument(),
    environment.production ? [] : StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    EffectsModule.forRoot([]),

    // Runtime store
    DataRuntimeModule,
    UiRuntimeModule,

    // Entity store
    UiEntityModule,

    // Page store
    UiPageModule,

    // Form store
    UiFormModule,

    // Layout store
    UiLayoutModule,

    // Email store
    DataEmailModule,
    UiEmailModule,

    // Searchlist store
    DataSearchlistModule,
    UiSearchlistModule,

    // Autocomplete store
    DataAutocompleteModule,
    UiAutocompleteModule,

    // Property store
    DataPropertyModule,
    UiPropertyModule,

    // Contact store
    DataContactModule,
    UiContactModule,

    // Promotion store
    DataPromotionModule,
    UiPromotionModule,

    // Matching group store
    DataMatchingGroupModule,
    UiMatchingGroupModule,

    // Matching store
    DataMatchingModule,
    UiMatchingModule,

    // Report store
    DataReportModule,
    UiReportModule,
    DataReportingModule,
    UiReportingModule,

    // Lead store
    DataLeadModule,
    UiLeadModule,

    // Agency preference store
    DataAgencyPreferenceModule,
    UiAgencyPreferenceModule,

    // Agency store
    DataAgencyModule,
    UiAgencyModule,

    // User store
    DataUserModule,
    UiUserModule,

    // Task store
    DataTaskModule,
    UiTaskModule,

    // History store
    DataHistoryModule,
    UiHistoryModule,

    // Sector store
    DataSectorModule,
    UiSectorModule,

    // Marketing Expense store
    DataMarketingExpenseModule,
    UiMarketingExpenseModule,

    // (Agency Portal) Portal Stores
    DataPortalModule,
    UiPortalModule,

    // Device store
    DataDeviceModule,
    UiDeviceModule,

    // Custom attribute store
    DataCustomAttributeModule,
    UiCustomAttributeModule,

    // Dns store
    DataDnsModule,
    UiDnsModule,

    // Email template store
    DataEmailTemplateModule,
    UiEmailTemplateModule,

    // Contract store
    DataContractModule,
    UiContractModule,

    // Upload store
    DataUploadModule,
    UiUploadModule,

    // Document store
    DataDocumentModule,
    UiDocumentModule,

    // Website store
    DataWebsiteModule,
    UiWebsiteModule,

    // Website article store
    DataWebsiteArticleModule,
    UiWebsiteArticleModule,

    // Layout store
    UiLayoutModule,

    // Account store
    DataAccountModule,
    UiAccountModule,

    // Emailing store
    UiEmailingModule,

    // Restriction store
    DataRestrictionModule,
    UiRestrictionModule,

    // Suggestion store
    DataSuggestionModule,
    UiSuggestionModule,

    // Gallery store
    UiGalleryModule,

    // Help
    UiHelpModule,

    // Agency backup store
    UiAgencyBackupModule,

    // Agency profile store
    UiAgencyProfileModule,

    // Agenda
    UiAgendaModule,

    // MLS store
    DataMlsModule,
    UiMlsModule,

    // Production
    UiProductionModule,
    DataProductionModule,

    // Process
    UiProcessModule,
    DataProcessModule,
  ],
  providers: [],
  declarations: [],
})
export class CoreStoreModule {}
