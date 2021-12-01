import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmailTemplatePageListComponent } from './email-template-page-list/email-template-page-list.component';
import { EmailTemplatePageReadComponent } from './email-template-page-read/email-template-page-read.component';
import { EmailTemplatePageWriteComponent } from './email-template-page-write/email-template-page-write.component';
import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';

const routes: Routes = [
  {
    path: 'add',
    component: EmailTemplatePageWriteComponent,
    canDeactivate: [CanDeactivateRouteGuard],
  },
  {
    path: ':id',
    component: EmailTemplatePageReadComponent,
  },
  {
    path: ':id/edit',
    component: EmailTemplatePageWriteComponent,
    canDeactivate: [CanDeactivateRouteGuard],
  },
  {
    path: '',
    component: EmailTemplatePageListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailTemplateRoutingModule {

}
