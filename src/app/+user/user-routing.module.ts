import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { UserPageWriteComponent } from './user-page-write/user-page-write.component';
import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        component: UserPageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {

}
