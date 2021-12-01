import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SectorComponent } from './sector.component';
import { SectorPageListComponent } from './sector-page-list/sector-page-list.component';
import { SectorPageWriteComponent } from './sector-page-write/sector-page-write.component';
import { SectorPageSearchComponent } from './sector-page-search/sector-page-search.component';
import { SectorPageReadComponent } from './sector-page-read/sector-page-read.component';
import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';

const routes: Routes = [
  {
    path: '',
    component: SectorComponent,
    children: [
      {
        path: 'add',
        component: SectorPageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: 'search',
        component: SectorPageSearchComponent,
      },
      {
        path: ':id',
        component: SectorPageReadComponent,
      },
      {
        path: ':id/edit',
        component: SectorPageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: '',
        component: SectorPageListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SectorRoutingModule {

}
