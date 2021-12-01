import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReportingComponent } from './reporting.component';
import { ReportingPageListComponent } from './reporting-page-list/reporting-page-list.component';

const routes: Routes = [
  {
    path: '',
    component: ReportingComponent,
    children: [
      {
        path: '',
        component: ReportingPageListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingRoutingModule {

}
