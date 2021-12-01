import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LeadPageListComponent } from './lead-page-list/lead-page-list.component';
import { LeadPageReadComponent } from './lead-page-read/lead-page-read.component';
import { LeadPageWriteComponent } from './lead-page-write/lead-page-write.component';
import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';

const routes: Routes = [
  {
    path: 'add',
    component: LeadPageWriteComponent,
    canDeactivate: [CanDeactivateRouteGuard],
  },
  {
    path: ':id',
    component: LeadPageReadComponent,
  },
  {
    path: ':id/edit',
    component: LeadPageWriteComponent,
    canDeactivate: [CanDeactivateRouteGuard],
  },
  {
    path: '',
    component: LeadPageListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadRoutingModule {

}
