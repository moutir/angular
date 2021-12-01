import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AgencyComponent } from './agency.component';
import { AgencyPageReadComponent } from './agency-page-read/agency-page-read.component';

const routes: Routes = [
  {
    path: '',
    component: AgencyComponent,
    children: [
      {
        path: '',
        component: AgencyPageReadComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgencyRoutingModule {

}
