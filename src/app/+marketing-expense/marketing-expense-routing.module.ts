import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';

import { MarketingExpensePageListComponent } from './marketing-expense-page-list/marketing-expense-page-list.component';
import { MarketingExpensePageReadComponent } from './marketing-expense-page-read/marketing-expense-page-read.component';
import { MarketingExpensePageWriteComponent } from './marketing-expense-page-write/marketing-expense-page-write.component';
import { MarketingExpenseComponent } from './marketing-expense.component';

const routes: Routes = [
  {
    path: '',
    component: MarketingExpenseComponent,
    children: [
      {
        path: 'add',
        component: MarketingExpensePageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: ':id',
        component: MarketingExpensePageReadComponent,
      },
      {
        path: ':id/edit',
        component: MarketingExpensePageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: '',
        component: MarketingExpensePageListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketingExpenseRoutingModule {

}
