import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ProductionFormTypeComponent } from './production-form-type/production-form-type.component';
import { ProductionPageReadComponent } from './production-page-read/production-page-read.component';
import { ProductionPageWriteComponent } from './production-page-write/production-page-write.component';
import { ProductionRoutingModule } from './production-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ProductionRoutingModule,
  ],
  declarations: [
    ProductionPageReadComponent,
    ProductionPageWriteComponent,
    ProductionFormTypeComponent,
  ],
})
export class ProductionModule {

}
