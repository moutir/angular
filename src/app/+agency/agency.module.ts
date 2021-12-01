import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AgencyRoutingModule } from './agency-routing.module';
import { AgencyComponent } from './agency.component';
import { AgencyPageReadComponent } from './agency-page-read/agency-page-read.component';
import { AgencyLinksComponent } from './agency-links/agency-links.component';

@NgModule({
  imports: [
    SharedModule,
    AgencyRoutingModule,
  ],
  declarations: [
    AgencyComponent,
    AgencyPageReadComponent,
    AgencyLinksComponent,
  ],
})
export class AgencyModule {

}
