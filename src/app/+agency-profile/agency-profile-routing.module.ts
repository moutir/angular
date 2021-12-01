import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AgencyProfileComponent } from './agency-profile.component';
import { AgencyProfilePageWriteComponent } from './agency-profile-page-write/agency-profile-page-write.component';
import { AgencyProfilePageReadComponent } from './agency-profile-page-read/agency-profile-page-read.component';
import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';

const routes: Routes = [
  {
    path: '',
    component: AgencyProfileComponent,
    children: [
      {
        path: ':id',
        component: AgencyProfilePageReadComponent,
      },
      {
        path: ':id/edit',
        component: AgencyProfilePageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: '',
        component: AgencyProfilePageReadComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgencyProfileRoutingModule {

}
