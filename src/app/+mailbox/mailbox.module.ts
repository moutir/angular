import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MailboxComponent } from './mailbox.component';
import { PaginationComponent } from './pagination/pagination.component';
import { KeysPipe } from './shared/keys.pipe';
import { ReversePipe } from './shared/reverse.pipe';
import { MailboxSearchComponent } from './mailbox-search/mailbox-search.component';
import { TreeComponent } from './tree/tree.component';
import { ConnectToEmailComponent } from './connect-to-email/connect-to-email.component';
import { EmailSerpComponent } from './email-serp/email-serp.component';
import { SafeHtmlPipe } from './shared/safe-html.pipe';
import { ImapSettingsComponent } from './imap-settings/imap-settings.component';
import { MailboxRoutingModule } from './mailbox-routing.module';
import { EmailPageComponent } from './email-page/email-page.component';
import { MailboxApiService } from './shared/mailbox-api.service';
import { PaginationService } from './shared/pagination.service';
import { MailboxStore } from './shared/mailbox.store';
import { MailboxConfig } from './mailbox.config';

@NgModule({
  imports: [
    SharedModule,
    MailboxRoutingModule,
  ],
  declarations: [
    MailboxComponent,
    EmailSerpComponent,
    MailboxSearchComponent,
    PaginationComponent,
    EmailPageComponent,
    ImapSettingsComponent,
    SafeHtmlPipe,
    ConnectToEmailComponent,
    ReversePipe,
    TreeComponent,
    KeysPipe,
  ],
  providers: [
    MailboxApiService,
    PaginationService,
    MailboxStore,
    MailboxConfig,
  ],
})
export class MailboxModule {
}
