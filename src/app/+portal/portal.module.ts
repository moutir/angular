import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { PortalPageListComponent } from './portal-page-list/portal-page-list.component';
import { PortalComponent } from './portal.component';
import { PortalRoutingModule } from './portal-routing.module';
import { PortalSearchlistComponent } from './portal-searchlist/portal-searchlist.component';
import { PortalTableComponent } from './portal-table/portal-table.component';
import { PortalTableRowComponent } from './portal-table-row/portal-table-row.component';
import { PortalTableHeaderComponent } from './portal-table-header/portal-table-header.component';
import { PortalPageReadComponent } from './portal-page-read/portal-page-read.component';
import { PortalPageWriteComponent } from './portal-page-write/portal-page-write.component';
import { PortalFormRequiredComponent } from './portal-form-required/portal-form-required.component';
import { PortalFormContactComponent } from './portal-form-contact/portal-form-contact.component';
import { PortalFormTechnicalComponent } from './portal-form-technical/portal-form-technical.component';
import { PortalFormSettingsComponent } from './portal-form-settings/portal-form-settings.component';

@NgModule({
  imports: [
    SharedModule,
    PortalRoutingModule,
  ],
  declarations: [
    PortalComponent,
    PortalPageListComponent,
    PortalSearchlistComponent,
    PortalTableHeaderComponent,
    PortalTableComponent,
    PortalTableRowComponent,
    PortalPageReadComponent,
    PortalPageWriteComponent,
    PortalFormRequiredComponent,
    PortalFormContactComponent,
    PortalFormTechnicalComponent,
    PortalFormSettingsComponent,
  ],
  exports: [
    PortalComponent,
    PortalPageListComponent,
    PortalSearchlistComponent,
    PortalTableHeaderComponent,
    PortalTableComponent,
    PortalTableRowComponent,
    PortalPageReadComponent,
    PortalPageWriteComponent,
    PortalFormRequiredComponent,
    PortalFormContactComponent,
    PortalFormTechnicalComponent,
    PortalFormSettingsComponent,
  ],
})
export class PortalModule {

}
