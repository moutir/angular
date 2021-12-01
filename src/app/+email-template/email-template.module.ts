import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EmailTemplateRoutingModule } from './email-template-routing.module';
import { EmailTemplatePageListComponent } from './email-template-page-list/email-template-page-list.component';
import { EmailTemplateSearchlistComponent } from './email-template-searchlist/email-template-searchlist.component';
import { EmailTemplateTableComponent } from './email-template-table/email-template-table.component';
import { EmailTemplateTableHeaderComponent } from './email-template-table-header/email-template-table-header.component';
import { EmailTemplateTableRowComponent } from './email-template-table-row/email-template-table-row.component';
import { EmailTemplatePageReadComponent } from './email-template-page-read/email-template-page-read.component';
import { EmailTemplatePageWriteComponent } from './email-template-page-write/email-template-page-write.component';
import { EmailTemplateFormContentComponent } from './email-template-form-content/email-template-form-content.component';
import { EmailTemplateFormRequiredComponent } from './email-template-form-required/email-template-form-required.component';

@NgModule({
  imports: [
    SharedModule,
    EmailTemplateRoutingModule,
  ],
  declarations: [
    EmailTemplatePageListComponent,
    EmailTemplateSearchlistComponent,
    EmailTemplateTableComponent,
    EmailTemplateTableHeaderComponent,
    EmailTemplateTableRowComponent,
    EmailTemplatePageReadComponent,
    EmailTemplatePageWriteComponent,
    EmailTemplateFormContentComponent,
    EmailTemplateFormRequiredComponent,
  ],
  exports: [
    EmailTemplatePageListComponent,
    EmailTemplateSearchlistComponent,
    EmailTemplateTableComponent,
    EmailTemplateTableHeaderComponent,
    EmailTemplateTableRowComponent,
    EmailTemplatePageReadComponent,
    EmailTemplatePageWriteComponent,
    EmailTemplateFormContentComponent,
    EmailTemplateFormRequiredComponent,
  ],
})
export class EmailTemplateModule {

}
