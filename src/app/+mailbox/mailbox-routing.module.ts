import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MailboxComponent } from './mailbox.component';
import { EmailSerpComponent } from './email-serp/email-serp.component';
import { ImapSettingsComponent } from './imap-settings/imap-settings.component';
import { EmailPageComponent } from './email-page/email-page.component';

const routes: Routes = [
  {
    path: '',
    component: MailboxComponent,
    children: [
      {
        path: 'inbox',
        redirectTo: 'inbox/1',
        pathMatch: 'full',
      },
      {
        path: 'inbox/:page',
        component: EmailSerpComponent,
      },
      {
        path: 'view/:id',
        component: EmailPageComponent,
      },
      {
        path: 'imap-settings',
        component: ImapSettingsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MailboxRoutingModule {
}
