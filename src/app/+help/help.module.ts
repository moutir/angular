import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HelpPageReadComponent } from './help-page-read/help-page-read.component';
import { HelpRoutingModule } from './help-routing.module';

@NgModule({
  imports: [
    SharedModule,
    HelpRoutingModule,
  ],
  declarations: [
    HelpPageReadComponent,
  ],
})
export class HelpModule {

}
