import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountComponent } from './account.component';
import { AccountPageListComponent } from './account-page-list/account-page-list.component';
import { AccountPageWriteComponent } from './account-page-write/account-page-write.component';
import { AccountPageSearchComponent } from './account-page-search/account-page-search.component';
import { AccountPageReadComponent } from './account-page-read/account-page-read.component';
import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {
        path: 'add',
        component: AccountPageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: 'search',
        component: AccountPageSearchComponent,
      },
      {
        path: ':id',
        component: AccountPageReadComponent,
      },
      {
        path: ':id/edit',
        component: AccountPageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: '',
        component: AccountPageListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {

}
