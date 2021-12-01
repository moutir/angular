import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EmailComponent } from './email.component';
import { EmailRoutingModule } from './email-routing.module';
import { EmailFormSearchComponent } from './email-form-search/email-form-search.component';
import { EmailTableRowComponent } from './email-table-row/email-table-row.component';
import { EmailTableHeaderComponent } from './email-table-header/email-table-header.component';
import { EmailPageListComponent } from './email-page-list/email-page-list.component';
import { EmailSearchlistComponent } from './email-searchlist/email-searchlist.component';
import { EmailTableComponent } from './email-table/email-table.component';
import { EmailModalSummaryComponent } from './email-modal-summary/email-modal-summary.component';

@NgModule({
  imports: [
    SharedModule,
    EmailRoutingModule,
  ],
  declarations: [
    EmailComponent,
    EmailTableComponent,
    EmailTableHeaderComponent,
    EmailTableRowComponent,
    EmailSearchlistComponent,
    EmailFormSearchComponent,
    EmailPageListComponent,
    EmailModalSummaryComponent,
  ],
})
export class EmailModule {

}
