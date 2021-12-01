import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomAttributeComponent } from './custom-attribute.component';
import { CustomAttributePageListComponent } from './custom-attribute-page-list/custom-attribute-page-list.component';
import { CustomAttributePageWriteComponent } from './custom-attribute-page-write/custom-attribute-page-write.component';
import { CustomAttributePageSearchComponent } from './custom-attribute-page-search/custom-attribute-page-search.component';
import { CustomAttributePageReadComponent } from './custom-attribute-page-read/custom-attribute-page-read.component';
import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';

const routes: Routes = [
  {
    path: '',
    component: CustomAttributeComponent,
    children: [
      {
        path: 'add',
        component: CustomAttributePageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: 'search',
        component: CustomAttributePageSearchComponent,
      },
      {
        path: ':id',
        component: CustomAttributePageReadComponent,
      },
      {
        path: ':id/edit',
        component: CustomAttributePageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: '',
        component: CustomAttributePageListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomAttributeRoutingModule {

}
