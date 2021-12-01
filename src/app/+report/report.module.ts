import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ReportSearchlistComponent } from './report-searchlist/report-searchlist.component';
import { ReportFormSearchComponent } from './report-form-search/report-form-search.component';
import { ReportTableRowComponent } from './report-table-row/report-table-row.component';
import { ReportTableHeaderComponent } from './report-table-header/report-table-header.component';
import { ReportTableComponent } from './report-table/report-table.component';
import { ReportPageListComponent } from './report-page-list/report-page-list.component';
import { ReportModalGenerationComponent } from './report-modal-generation/report-modal-generation.component';
import { ReportFormGenerationComponent } from './report-form-generation/report-form-generation.component';
import { ReportRoutingModule } from './report-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ReportRoutingModule,
  ],
  declarations: [
    ReportSearchlistComponent,
    ReportFormSearchComponent,
    ReportTableComponent,
    ReportTableHeaderComponent,
    ReportTableRowComponent,
    ReportPageListComponent,
    ReportModalGenerationComponent,
    ReportFormGenerationComponent,
  ],
})
export class ReportModule {

}
