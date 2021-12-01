import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AgencyPreferenceRoutingModule } from './agency-preference-routing.module';
import { AgencyPreferencePageWriteComponent } from './agency-preference-page-write/agency-preference-page-write.component';
import { AgencyPreferenceFormRequiredComponent } from './agency-preference-form-required/agency-preference-form-required.component';

@NgModule({
  imports: [
    SharedModule,
    AgencyPreferenceRoutingModule,
  ],
  declarations: [
    AgencyPreferencePageWriteComponent,
    AgencyPreferenceFormRequiredComponent,
  ],
})
export class AgencyPreferenceModule {

}
