import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { DeviceRoutingModule } from './device-routing.module';
import { DevicePageListComponent } from './device-page-list/device-page-list.component';
import { DeviceFormSearchComponent } from './device-form-search/device-form-search.component';
import { DeviceSearchlistComponent } from './device-searchlist/device-searchlist.component';
import { DeviceTableHeaderComponent } from './device-table-header/device-table-header.component';
import { DeviceTableComponent } from './device-table/device-table.component';
import { DeviceTableRowComponent } from './device-table-row/device-table-row.component';

@NgModule({
  imports: [
    SharedModule,
    DeviceRoutingModule,
  ],
  declarations: [
    DevicePageListComponent,
    DeviceFormSearchComponent,
    DeviceSearchlistComponent,
    DevicePageListComponent,
    DeviceTableHeaderComponent,
    DeviceTableComponent,
    DeviceTableRowComponent,
  ],
  exports: [
    DevicePageListComponent,
    DeviceFormSearchComponent,
    DeviceSearchlistComponent,
    DeviceTableHeaderComponent,
    DeviceTableComponent,
    DeviceTableRowComponent,
  ],
})
export class DeviceModule {

}
