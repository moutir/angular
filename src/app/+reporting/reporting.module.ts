import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ReportingComponent } from './reporting.component';
import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingSearchlistComponent } from './reporting-searchlist/reporting-searchlist.component';
import { ReportingFormSearchComponent } from './reporting-form-search/reporting-form-search.component';
import { ReportingTableRowComponent } from './reporting-table-row/reporting-table-row.component';
import { ReportingTableHeaderComponent } from './reporting-table-header/reporting-table-header.component';
import { ReportingTableComponent } from './reporting-table/reporting-table.component';
import { ReportingPageListComponent } from './reporting-page-list/reporting-page-list.component';

@NgModule({
  imports: [
    SharedModule,
    ReportingRoutingModule,
  ],
  declarations: [
    ReportingComponent,
    ReportingSearchlistComponent,
    ReportingFormSearchComponent,
    ReportingTableComponent,
    ReportingTableHeaderComponent,
    ReportingTableRowComponent,
    ReportingPageListComponent,
  ],
})
export class ReportingModule {

}
