import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContractComponent } from './contract.component';
import { ContractPageListComponent } from './contract-page-list/contract-page-list.component';
import { ContractPageWriteComponent } from './contract-page-write/contract-page-write.component';
import { ContractPageSearchComponent } from './contract-page-search/contract-page-search.component';
import { ContractPageReadComponent } from './contract-page-read/contract-page-read.component';
import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';

const routes: Routes = [
  {
    path: '',
    component: ContractComponent,
    children: [
      {
        path: 'add',
        component: ContractPageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: 'search',
        component: ContractPageSearchComponent,
      },
      {
        path: ':id',
        component: ContractPageReadComponent,
      },
      {
        path: ':id/edit',
        component: ContractPageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: '',
        component: ContractPageListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractRoutingModule {

}
