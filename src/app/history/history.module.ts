import { NgModule } from '@angular/core';

import { HistoryModalComponent } from './history-modal/history-modal.component';
import { HistoryTableHeaderComponent } from './history-table-header/history-table-header.component';
import { HistoryTableRowComponent } from './history-table-row/history-table-row.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    HistoryModalComponent,
    HistoryTableHeaderComponent,
    HistoryTableRowComponent,
  ],
  exports: [
    HistoryModalComponent,
  ],
  providers: [],
})
export class HistoryModule {

}
