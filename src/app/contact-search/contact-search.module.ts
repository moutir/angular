import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapModule } from '../map/map.module';
import { ContactSearchMapComponent } from './contact-search-map/contact-search-map.component';
import { ContactSearchMapService } from './shared/contact-search-map.service';

@NgModule({
  imports: [
    CommonModule,
    MapModule,
  ],
  declarations: [
    ContactSearchMapComponent,
  ],
  exports: [
    ContactSearchMapComponent,
  ],
  providers: [
    ContactSearchMapService,
  ],
})
export class ContactSearchModule {

}
