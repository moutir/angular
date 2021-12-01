import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { SectorComponent } from './sector.component';
import { SectorRoutingModule } from './sector-routing.module';
import { SectorFormSearchComponent } from './sector-form-search/sector-form-search.component';
import { SectorTableRowComponent } from './sector-table-row/sector-table-row.component';
import { SectorTableHeaderComponent } from './sector-table-header/sector-table-header.component';
import { SectorPageListComponent } from './sector-page-list/sector-page-list.component';
import { SectorPageWriteComponent } from './sector-page-write/sector-page-write.component';
import { SectorPageReadComponent } from './sector-page-read/sector-page-read.component';
import { SectorPageSearchComponent } from './sector-page-search/sector-page-search.component';
import { SectorSearchlistComponent } from './sector-searchlist/sector-searchlist.component';
import { SectorTableComponent } from './sector-table/sector-table.component';
import { PropertyModule } from '../property/property.module';
import { SectorFormRequiredComponent } from './sector-form-required/sector-form-required.component';

@NgModule({
  imports: [
    SharedModule,
    SectorRoutingModule,
    PropertyModule,
  ],
  declarations: [
    SectorComponent,
    SectorTableComponent,
    SectorTableHeaderComponent,
    SectorTableRowComponent,
    SectorSearchlistComponent,
    SectorFormSearchComponent,
    SectorFormRequiredComponent,
    SectorPageListComponent,
    SectorPageSearchComponent,
    SectorPageWriteComponent,
    SectorPageReadComponent,
  ],
})
export class SectorModule {

}
