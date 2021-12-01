import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MatchingRoutingModule } from './matching-routing.module';
import { MatchingSearchlistComponent } from './matching-searchlist/matching-searchlist.component';
import { MatchingFormSearchComponent } from './matching-form-search/matching-form-search.component';
import { MatchingTableRowComponent } from './matching-table-row/matching-table-row.component';
import { MatchingTableHeaderComponent } from './matching-table-header/matching-table-header.component';
import { MatchingTableComponent } from './matching-table/matching-table.component';
import { MatchingPageListComponent } from './matching-page-list/matching-page-list.component';

@NgModule({
  imports: [
    SharedModule,
    MatchingRoutingModule,
  ],
  declarations: [
    MatchingSearchlistComponent,
    MatchingFormSearchComponent,
    MatchingTableHeaderComponent,
    MatchingTableRowComponent,
    MatchingTableComponent,
    MatchingPageListComponent,
  ],
})
export class MatchingModule {

}
