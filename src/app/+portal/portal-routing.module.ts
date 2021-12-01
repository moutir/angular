import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';

import { PortalPageListComponent } from './portal-page-list/portal-page-list.component';
import { PortalComponent } from './portal.component';
import { PortalPageReadComponent } from './portal-page-read/portal-page-read.component';
import { PortalPageWriteComponent } from './portal-page-write/portal-page-write.component';

const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    children: [
      {
        path: 'add',
        component: PortalPageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: ':id',
        component: PortalPageReadComponent,
      },
      {
        path: ':id/edit',
        component: PortalPageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: '',
        component: PortalPageListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortalRoutingModule {

}
