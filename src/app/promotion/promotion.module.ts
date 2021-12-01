import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HistoryModule } from '../history/history.module';
import { PromotionSearchlistComponent } from './promotion-searchlist/promotion-searchlist.component';
import { PromotionTableComponent } from './promotion-table/promotion-table.component';
import { PromotionTableRowComponent } from './promotion-table-row/promotion-table-row.component';
import { PromotionTableHeaderComponent } from './promotion-table-header/promotion-table-header.component';
import { PromotionFormSearchComponent } from './promotion-form-search/promotion-form-search.component';
import { PromotionModalRemoveMlsComponent } from './promotion-modal-remove-mls/promotion-modal-remove-mls.component';
import { PromotionPageListComponent } from './promotion-page-list/promotion-page-list.component';

@NgModule({
  imports: [
    SharedModule,
    HistoryModule,
  ],
  declarations: [
    PromotionSearchlistComponent,
    PromotionTableHeaderComponent,
    PromotionTableRowComponent,
    PromotionTableComponent,
    PromotionFormSearchComponent,
    PromotionModalRemoveMlsComponent,
    PromotionPageListComponent,
  ],
  exports: [
    PromotionSearchlistComponent,
    PromotionTableHeaderComponent,
    PromotionTableRowComponent,
    PromotionTableComponent,
    PromotionFormSearchComponent,
    PromotionModalRemoveMlsComponent,
    PromotionPageListComponent,
  ],
})
export class PromotionModule {

}
