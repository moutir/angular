import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MlsRoutingModule } from './mls-routing.module';
import { MlsComponent } from './mls.component';
import { MlsFormSearchComponent } from './mls-form-search/mls-form-search.component';
import { MlsTableRowComponent } from './mls-table-row/mls-table-row.component';
import { MlsTableHeaderComponent } from './mls-table-header/mls-table-header.component';
import { MlsPageListComponent } from './mls-page-list/mls-page-list.component';
import { MlsSearchlistComponent } from './mls-searchlist/mls-searchlist.component';
import { MlsTableComponent } from './mls-table/mls-table.component';
import { MlsPageReadComponent } from './mls-page-read/mls-page-read.component';
import { MlsPageWriteComponent } from './mls-page-write/mls-page-write.component';
import { MlsAgencyPanelComponent } from './mls-agency-panel/mls-agency-panel.component';
import { MlsFormRequiredComponent } from './mls-form-required/mls-form-required.component';

@NgModule({
  imports: [
    SharedModule,
    MlsRoutingModule,
  ],
  declarations: [
    MlsComponent,
    MlsTableComponent,
    MlsTableHeaderComponent,
    MlsTableRowComponent,
    MlsFormSearchComponent,
    MlsSearchlistComponent,
    MlsFormSearchComponent,
    MlsPageListComponent,
    MlsPageReadComponent,
    MlsPageWriteComponent,
    MlsAgencyPanelComponent,
    MlsFormRequiredComponent,
  ],
})
export class MlsModule {

}
