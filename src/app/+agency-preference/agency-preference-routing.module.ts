import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AgencyPreferencePageWriteComponent } from './agency-preference-page-write/agency-preference-page-write.component';
import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';

const routes: Routes = [
  {
    path: '',
    component: AgencyPreferencePageWriteComponent,
    canDeactivate: [CanDeactivateRouteGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgencyPreferenceRoutingModule {

}
