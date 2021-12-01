import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';
import { AccountFormSearchComponent } from './account-form-search/account-form-search.component';
import { AccountTableRowComponent } from './account-table-row/account-table-row.component';
import { AccountTableHeaderComponent } from './account-table-header/account-table-header.component';
import { AccountPageListComponent } from './account-page-list/account-page-list.component';
import { AccountPageWriteComponent } from './account-page-write/account-page-write.component';
import { AccountPageReadComponent } from './account-page-read/account-page-read.component';
import { AccountPageSearchComponent } from './account-page-search/account-page-search.component';
import { AccountSearchlistComponent } from './account-searchlist/account-searchlist.component';
import { AccountTableComponent } from './account-table/account-table.component';

@NgModule({
  imports: [
    SharedModule,
    AccountRoutingModule,
  ],
  declarations: [
    AccountComponent,
    AccountTableComponent,
    AccountTableHeaderComponent,
    AccountTableRowComponent,
    AccountSearchlistComponent,
    AccountFormSearchComponent,
    AccountPageListComponent,
    AccountPageSearchComponent,
    AccountPageWriteComponent,
    AccountPageReadComponent,
  ],
})
export class AccountModule {

}
