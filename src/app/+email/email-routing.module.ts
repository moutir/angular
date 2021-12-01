import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmailComponent } from './email.component';
import { EmailPageListComponent } from './email-page-list/email-page-list.component';

const routes: Routes = [
  {
    path: 'sent',
    component: EmailComponent,
    children: [
      {
        path: '',
        component: EmailPageListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailRoutingModule {

}
