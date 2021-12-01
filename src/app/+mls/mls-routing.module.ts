import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MlsComponent } from './mls.component';
import { MlsPageListComponent } from './mls-page-list/mls-page-list.component';
import { MlsPageReadComponent } from './mls-page-read/mls-page-read.component';
import { MlsPageWriteComponent } from './mls-page-write/mls-page-write.component';
import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';

const routes: Routes = [
  {
    path: '',
    component: MlsComponent,
    children: [
      {
        path: 'add',
        component: MlsPageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: ':id',
        component: MlsPageReadComponent,
      },
      {
        path: ':id/edit',
        component: MlsPageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: '',
        component: MlsPageListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MlsRoutingModule {

}
