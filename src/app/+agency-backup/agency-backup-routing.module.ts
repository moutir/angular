import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AgencyBackupPageReadComponent } from './agency-backup-page-read/agency-backup-page-read.component';

const routes: Routes = [
  {
    path: '',
    component: AgencyBackupPageReadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgencyBackupRoutingModule {

}
