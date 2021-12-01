import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ProcessComponent } from './process.component';
import { ProcessRoutingModule } from './process-routing.module';
import { ProcessFormSearchComponent } from './process-form-search/process-form-search.component';
import { ProcessTableRowComponent } from './process-table-row/process-table-row.component';
import { ProcessTableHeaderComponent } from './process-table-header/process-table-header.component';
import { ProcessPageListComponent } from './process-page-list/process-page-list.component';
import { ProcessPageReadComponent } from './process-page-read/process-page-read.component';
import { ProcessSearchlistComponent } from './process-searchlist/process-searchlist.component';
import { ProcessTableComponent } from './process-table/process-table.component';
import { GalleryModule } from '../gallery/gallery.module';

@NgModule({
  imports: [
    SharedModule,
    ProcessRoutingModule,
    GalleryModule,
  ],
  declarations: [
    ProcessComponent,
    ProcessTableComponent,
    ProcessTableHeaderComponent,
    ProcessTableRowComponent,
    ProcessSearchlistComponent,
    ProcessFormSearchComponent,
    ProcessPageListComponent,
    ProcessPageReadComponent,
  ],
})
export class ProcessModule {

}
