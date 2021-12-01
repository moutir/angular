import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DnsPageListComponent } from './dns-page-list/dns-page-list.component';

const routes: Routes = [
  {
    path: '',
    component: DnsPageListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DnsRoutingModule {

}
