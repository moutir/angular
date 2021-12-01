import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EmailingComponent } from './emailing.component';
import { EmailingRoutingModule } from './emailing-routing.module';
import { EmailingPageWriteComponent } from './emailing-page-write/emailing-page-write.component';
import { EmailingFormGeneralComponent } from './emailing-form-general/emailing-form-general.component';
import { EmailingFormContentComponent } from './emailing-form-content/emailing-form-content.component';
import { EmailingModalSummaryComponent } from './emailing-modal-summary/emailing-modal-summary.component';
import { EmailingModalPreviewComponent } from './emailing-modal-preview/emailing-modal-preview.component';

@NgModule({
  imports: [
    SharedModule,
    EmailingRoutingModule,
  ],
  declarations: [
    EmailingComponent,
    EmailingFormGeneralComponent,
    EmailingFormContentComponent,
    EmailingPageWriteComponent,
    EmailingModalSummaryComponent,
    EmailingModalPreviewComponent,
  ],
})
export class EmailingModule {

}
