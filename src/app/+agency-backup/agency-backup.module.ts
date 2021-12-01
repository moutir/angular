import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AgencyBackupRoutingModule } from './agency-backup-routing.module';
import { AgencyBackupPageReadComponent } from './agency-backup-page-read/agency-backup-page-read.component';

@NgModule({
  imports: [
    SharedModule,
    AgencyBackupRoutingModule,
  ],
  declarations: [
    AgencyBackupPageReadComponent,
  ],
})
export class AgencyBackupModule {

}
