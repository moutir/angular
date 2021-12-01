import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LegacyComponent } from './layout/legacy/legacy.component';

const routes: Routes = [

  // Dashboard (async)
  {
    path: 'dashboard',
    loadChildren: () => import('./+dashboard/dashboard.module').then(m => m.DashboardModule),
  },

  // Mailbox (async)
  {
    path: 'mailbox',
    loadChildren: () => import('./+mailbox/mailbox.module').then(m => m.MailboxModule),
  },

  // Matching (async)
  {
    path: 'matching',
    loadChildren: () => import('./+matching/matching.module').then(m => m.MatchingModule),
  },

  // Matching-group (async)
  {
    path: 'matching-group',
    loadChildren: () => import('./+matching-group/matching-group.module').then(m => m.MatchingGroupModule),
  },

  // Report (async)
  {
    path: 'report',
    loadChildren: () => import('./+report/report.module').then(m => m.ReportModule),
  },

  // Reporting (async)
  {
    path: 'reporting',
    loadChildren: () => import('./+reporting/reporting.module').then(m => m.ReportingModule),
  },

  // Sector (async)
  {
    path: 'sector',
    loadChildren: () => import('./+sector/sector.module').then(m => m.SectorModule),
  },

  // Agency Preference (async)
  {
    path: 'agency-preference',
    loadChildren: () => import('./+agency-preference/agency-preference.module').then(m => m.AgencyPreferenceModule),
  },

  // Agency (async)
  {
    path: 'agency',
    loadChildren: () => import('./+agency/agency.module').then(m => m.AgencyModule),
  },

  // Email (async)
  {
    path: 'email',
    loadChildren: () => import('./+email/email.module').then(m => m.EmailModule),
  },

  // Device (async)
  {
    path: 'device',
    loadChildren: () => import('./+device/device.module').then(m => m.DeviceModule),
  },

  // Portal (async)
  {
    path: 'portal',
    loadChildren: () => import('./+portal/portal.module').then(m => m.PortalModule),
  },

  // Custom attribute (async)
  {
    path: 'custom-attribute',
    loadChildren: () => import('./+custom-attribute/custom-attribute.module').then(m => m.CustomAttributeModule),
  },

  // Dns (async)
  {
    path: 'dns',
    loadChildren: () => import('./+dns/dns.module').then(m => m.DnsModule),
  },

  // Email template (async)
  {
    path: 'email-template',
    loadChildren: () => import('./+email-template/email-template.module').then(m => m.EmailTemplateModule),
  },

  // Emailing (async)
  {
    path: 'emailing',
    pathMatch: 'full',
    loadChildren: () => import('./+emailing/emailing.module').then(m => m.EmailingModule),
  },

  // Contract (async)
  {
    path: 'contract',
    loadChildren: () => import('./+contract/contract.module').then(m => m.ContractModule),
  },

  // Dummy (async)
  {
    path: 'dummy',
    loadChildren: () => import('./+dummy/dummy.module').then(m => m.DummyModule),
  },

  // Website (async)
  {
    path: 'website',
    loadChildren: () => import('./+website/website.module').then(m => m.WebsiteModule),
  },

  // Help (async)
  {
    path: 'help',
    loadChildren: () => import('./+help/help.module').then(m => m.HelpModule),
  },

  // Website article (async)
  {
    path: 'website-article',
    loadChildren: () => import('./+website-article/website-article.module').then(m => m.WebsiteArticleModule),
  },

  // Marketing expense (async)
  {
    path: 'marketing-expense',
    loadChildren: () => import('./+marketing-expense/marketing-expense.module').then(m => m.MarketingExpenseModule),
  },

  // Agency data backup (async)
  {
    path: 'data-backup',
    loadChildren: () => import('./+agency-backup/agency-backup.module').then(m => m.AgencyBackupModule),
  },

  // Agency profile (async)
  {
    path: 'agency-profile',
    loadChildren: () => import('./+agency-profile/agency-profile.module').then(m => m.AgencyProfileModule),
  },

  // Agenda (async)
  {
    path: 'agenda',
    pathMatch: 'full',
    loadChildren: () => import('./+agenda/agenda.module').then(m => m.AgendaModule),
  },

  // MLS (async)
  {
    path: 'mls',
    loadChildren: () => import('./+mls/mls.module').then(m => m.MlsModule),
  },

  // Task (async)
  {
    path: 'tasks',
    loadChildren: () => import('./+task/task.module').then(m => m.TaskModule),
  },

  // Restriction (async)
  {
    path: 'restriction',
    loadChildren: () => import('./+restriction/restriction.module').then(m => m.RestrictionModule),
  },

  // Lead (async)
  {
    path: 'leads',
    loadChildren: () => import('./+lead/lead.module').then(m => m.LeadModule),
  },

  // Suggestion (async)
  {
    path: 'suggestion',
    loadChildren: () => import('./+suggestion/suggestion.module').then(m => m.SuggestionModule),
  },

  // Production (async)
  {
    path: 'production',
    loadChildren: () => import('./+production/production.module').then(m => m.ProductionModule),
  },

  // Account (async)
  {
    path: 'account',
    loadChildren: () => import('./+account/account.module').then(m => m.AccountModule),
  },
  

  // User (async)
  {
    path: 'user',
    loadChildren: () => import('./+user/user.module').then(m => m.UserModule),
  },

  // Process (async)
  {
    path: 'process',
    loadChildren: () => import('./+process/process.module').then(m => m.ProcessModule),
  },

  // Not found
  {
    path: '**',
    component: LegacyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {
}
