import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MarketingExpensePageListComponent } from './marketing-expense-page-list/marketing-expense-page-list.component';
import { MarketingExpenseComponent } from './marketing-expense.component';
import { MarketingExpenseRoutingModule } from './marketing-expense-routing.module';
import { MarketingExpenseSearchlistComponent } from './marketing-expense-searchlist/marketing-expense-searchlist.component';
import { MarketingExpenseTableComponent } from './marketing-expense-table/marketing-expense-table.component';
import { MarketingExpenseTableRowComponent } from './marketing-expense-table-row/marketing-expense-table-row.component';
import { MarketingExpenseTableHeaderComponent } from './marketing-expense-table-header/marketing-expense-table-header.component';
import { MarketingExpenseFormSearchComponent } from './marketing-expense-form-search/marketing-expense-form-search.component';
import { MarketingExpensePageReadComponent } from './marketing-expense-page-read/marketing-expense-page-read.component';
import { MarketingExpensePageWriteComponent } from './marketing-expense-page-write/marketing-expense-page-write.component';
import { MarketingExpenseFormGeneralComponent } from './marketing-expense-form-general/marketing-expense-form-general.component';

@NgModule({
  imports: [
    SharedModule,
    MarketingExpenseRoutingModule,
  ],
  declarations: [
    MarketingExpenseComponent,
    MarketingExpensePageListComponent,
    MarketingExpenseSearchlistComponent,
    MarketingExpenseTableHeaderComponent,
    MarketingExpenseTableComponent,
    MarketingExpenseTableRowComponent,
    MarketingExpenseFormSearchComponent,
    MarketingExpensePageReadComponent,
    MarketingExpensePageWriteComponent,
    MarketingExpenseFormGeneralComponent,
  ],
})
export class MarketingExpenseModule {

}
