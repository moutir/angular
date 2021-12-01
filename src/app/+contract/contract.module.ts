import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ContractComponent } from './contract.component';
import { ContractRoutingModule } from './contract-routing.module';
import { ContractFormSearchComponent } from './contract-form-search/contract-form-search.component';
import { ContractTableRowComponent } from './contract-table-row/contract-table-row.component';
import { ContractTableHeaderComponent } from './contract-table-header/contract-table-header.component';
import { ContractPageListComponent } from './contract-page-list/contract-page-list.component';
import { ContractPageWriteComponent } from './contract-page-write/contract-page-write.component';
import { ContractPageReadComponent } from './contract-page-read/contract-page-read.component';
import { ContractPageSearchComponent } from './contract-page-search/contract-page-search.component';
import { ContractSearchlistComponent } from './contract-searchlist/contract-searchlist.component';
import { ContractTableComponent } from './contract-table/contract-table.component';
import { ContractFormGeneralComponent } from './contract-form-general/contract-form-general.component';
import { ContractFormDealComponent } from './contract-form-deal/contract-form-deal.component';

@NgModule({
  imports: [
    SharedModule,
    ContractRoutingModule,
  ],
  declarations: [
    ContractComponent,
    ContractTableComponent,
    ContractTableHeaderComponent,
    ContractTableRowComponent,
    ContractSearchlistComponent,
    ContractFormSearchComponent,
    ContractPageListComponent,
    ContractPageSearchComponent,
    ContractPageWriteComponent,
    ContractPageReadComponent,
    ContractFormGeneralComponent,
    ContractFormDealComponent,
  ],
})
export class ContractModule {

}
