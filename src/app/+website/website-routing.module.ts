import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WebsiteComponent } from './website.component';
import { WebsitePageListComponent } from './website-page-list/website-page-list.component';
import { WebsitePageReadComponent } from './website-page-read/website-page-read.component';
import { WebsitePageWriteComponent } from './website-page-write/website-page-write.component';
import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';

const routes: Routes = [
  {
    path: '',
    component: WebsiteComponent,
    children: [
      {
        path: 'add',
        component: WebsitePageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: ':id',
        component: WebsitePageReadComponent,
      },
      {
        path: ':id/edit',
        component: WebsitePageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: '',
        component: WebsitePageListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebsiteRoutingModule {

}
