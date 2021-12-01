import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { LeadSearchlistComponent } from './lead-searchlist/lead-searchlist.component';
import { LeadTableHeaderComponent } from './lead-table-header/lead-table-header.component';
import { LeadTableRowComponent } from './lead-table-row/lead-table-row.component';
import { LeadFormSearchComponent } from './lead-form-search/lead-form-search.component';
import { LeadTableComponent } from './lead-table/lead-table.component';
import { LeadPageListComponent } from './lead-page-list/lead-page-list.component';
import { LeadPageReadComponent } from './lead-page-read/lead-page-read.component';
import { LeadPageWriteComponent } from './lead-page-write/lead-page-write.component';
import { LeadComponent } from './lead.component';
import { LeadFormGeneralComponent } from './lead-form-general/lead-form-general.component';
import { LeadFormValidationComponent } from './lead-form-validation/lead-form-validation.component';
import { LeadRoutingModule } from './lead-routing.module';
import { LeadModalModifyStatusComponent } from './lead-modal-modify-status/lead-modal-modify-status.component';

@NgModule({
  imports: [
    SharedModule,
    LeadRoutingModule,
  ],
  declarations: [
    LeadComponent,
    LeadSearchlistComponent,
    LeadTableHeaderComponent,
    LeadTableRowComponent,
    LeadTableComponent,
    LeadFormSearchComponent,
    LeadPageListComponent,
    LeadPageReadComponent,
    LeadPageWriteComponent,
    LeadFormGeneralComponent,
    LeadFormValidationComponent,
    LeadModalModifyStatusComponent,
  ],
})
export class LeadModule {

}
