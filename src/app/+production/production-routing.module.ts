import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';
import { ProductionPageReadComponent } from './production-page-read/production-page-read.component';
import { ProductionPageWriteComponent } from './production-page-write/production-page-write.component';

const routes: Routes = [
  {
    path: '',
    component: ProductionPageReadComponent,
  },
  {
    path: ':id',
    component: ProductionPageReadComponent,
  },
  {
    path: ':id/edit',
    component: ProductionPageWriteComponent,
    canDeactivate: [CanDeactivateRouteGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionRoutingModule {

}
