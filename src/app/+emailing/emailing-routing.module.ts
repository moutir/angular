import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmailingComponent } from './emailing.component';
import { EmailingPageWriteComponent } from './emailing-page-write/emailing-page-write.component';
import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';

const routes: Routes = [
  {
    path: '',
    component: EmailingComponent,
    children: [
      {
        path: '',
        component: EmailingPageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailingRoutingModule {

}
