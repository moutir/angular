import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { DnsRoutingModule } from './dns-routing.module';
import { DnsPageListComponent } from './dns-page-list/dns-page-list.component';
import { DnsSearchlistComponent } from './dns-searchlist/dns-searchlist.component';
import { DnsTableComponent } from './dns-table/dns-table.component';
import { DnsTableRowComponent } from './dns-table-row/dns-table-row.component';

@NgModule({
  imports: [
    SharedModule,
    DnsRoutingModule,
  ],
  declarations: [
    DnsPageListComponent,
    DnsSearchlistComponent,
    DnsTableComponent,
    DnsTableRowComponent,
  ],
  exports: [
    DnsPageListComponent,
    DnsSearchlistComponent,
    DnsTableComponent,
    DnsTableRowComponent,
  ],
})
export class DnsModule {

}
