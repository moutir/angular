import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReportPageListComponent } from './report-page-list/report-page-list.component';

const routes: Routes = [
  {
    path: '',
    component: ReportPageListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {

}
