import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RestrictionComponent } from './restriction.component';
import { RestrictionPageListComponent } from './restriction-page-list/restriction-page-list.component';
import { RestrictionPageWriteComponent } from './restriction-page-write/restriction-page-write.component';
import { RestrictionPageSearchComponent } from './restriction-page-search/restriction-page-search.component';
import { RestrictionPageReadComponent } from './restriction-page-read/restriction-page-read.component';
import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';

const routes: Routes = [
  {
    path: '',
    component: RestrictionComponent,
    children: [
      {
        path: 'add',
        component: RestrictionPageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: 'search',
        component: RestrictionPageSearchComponent,
      },
      {
        path: ':id',
        component: RestrictionPageReadComponent,
      },
      {
        path: ':id/edit',
        component: RestrictionPageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: '',
        component: RestrictionPageListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestrictionRoutingModule {

}
