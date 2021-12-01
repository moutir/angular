import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProcessComponent } from './process.component';
import { ProcessPageListComponent } from './process-page-list/process-page-list.component';
import { ProcessPageReadComponent } from './process-page-read/process-page-read.component';

const routes: Routes = [
  {
    path: '',
    component: ProcessComponent,
    children: [
      {
        path: ':id',
        component: ProcessPageReadComponent,
      },
      {
        path: '',
        component: ProcessPageListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessRoutingModule {

}
