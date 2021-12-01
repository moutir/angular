import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AgendaFormRequiredComponent } from './agenda-form-required/agenda-form-required.component';
import { AgendaPageWriteComponent } from './agenda-page-write/agenda-page-write.component';
import { AgendaRoutingModule } from './agenda-routing.module';

@NgModule({
  imports: [
    SharedModule,
    AgendaRoutingModule,
  ],
  declarations: [
    AgendaPageWriteComponent,
    AgendaFormRequiredComponent,
  ],
})
export class AgendaModule {

}
