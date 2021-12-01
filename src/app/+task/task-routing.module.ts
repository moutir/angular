import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskComponent } from './task.component';
import { TaskPageListComponent } from './task-page-list/task-page-list.component';
import { TaskPageWriteComponent } from './task-page-write/task-page-write.component';
import { TaskPageReadComponent } from './task-page-read/task-page-read.component';
import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';

const routes: Routes = [
  {
    path: '',
    component: TaskComponent,
    children: [
      {
        path: 'add',
        component: TaskPageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: ':id',
        component: TaskPageReadComponent,
      },
      {
        path: ':id/edit',
        component: TaskPageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: '',
        component: TaskPageListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule {

}
