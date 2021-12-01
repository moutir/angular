import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { RestrictionComponent } from './restriction.component';
import { RestrictionRoutingModule } from './restriction-routing.module';
import { RestrictionFormSearchComponent } from './restriction-form-search/restriction-form-search.component';
import { RestrictionTableRowComponent } from './restriction-table-row/restriction-table-row.component';
import { RestrictionTableHeaderComponent } from './restriction-table-header/restriction-table-header.component';
import { RestrictionPageListComponent } from './restriction-page-list/restriction-page-list.component';
import { RestrictionPageWriteComponent } from './restriction-page-write/restriction-page-write.component';
import { RestrictionPageReadComponent } from './restriction-page-read/restriction-page-read.component';
import { RestrictionPageSearchComponent } from './restriction-page-search/restriction-page-search.component';
import { RestrictionSearchlistComponent } from './restriction-searchlist/restriction-searchlist.component';
import { RestrictionTableComponent } from './restriction-table/restriction-table.component';
import { RestrictionFormRequiredComponent } from './restriction-form-required/restriction-form-required.component';

@NgModule({
  imports: [
    SharedModule,
    RestrictionRoutingModule,
  ],
  declarations: [
    RestrictionComponent,
    RestrictionTableComponent,
    RestrictionTableHeaderComponent,
    RestrictionTableRowComponent,
    RestrictionSearchlistComponent,
    RestrictionFormSearchComponent,
    RestrictionFormRequiredComponent,
    RestrictionPageListComponent,
    RestrictionPageSearchComponent,
    RestrictionPageWriteComponent,
    RestrictionPageReadComponent,
  ],
})
export class RestrictionModule {

}
