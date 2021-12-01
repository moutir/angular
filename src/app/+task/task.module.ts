import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { TaskSearchlistComponent } from './task-searchlist/task-searchlist.component';
import { TaskTableComponent } from './task-table/task-table.component';
import { TaskTableRowComponent } from './task-table-row/task-table-row.component';
import { TaskTableHeaderComponent } from './task-table-header/task-table-header.component';
import { TaskFormSearchComponent } from './task-form-search/task-form-search.component';
import { TaskPageListComponent } from './task-page-list/task-page-list.component';
import { TaskPageReadComponent } from './task-page-read/task-page-read.component';
import { TaskPageWriteComponent } from './task-page-write/task-page-write.component';
import { TaskComponent } from './task.component';
import { TaskFormGeneralComponent } from './task-form-general/task-form-general.component';
import { TaskRoutingModule } from './task-routing.module';

@NgModule({
  imports: [
    SharedModule,
    TaskRoutingModule,
  ],
  declarations: [
    TaskComponent,
    TaskSearchlistComponent,
    TaskTableHeaderComponent,
    TaskTableRowComponent,
    TaskTableComponent,
    TaskFormSearchComponent,
    TaskPageListComponent,
    TaskPageReadComponent,
    TaskPageWriteComponent,
    TaskFormGeneralComponent,
  ],
})
export class TaskModule {

}
