import { NgModule, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressService } from './shared/address.service';
import { AddressStrategyAbstract } from './shared/address-strategy.abstract';
import { GooglePlacesStrategy } from './shared/strategy/google-places.strategy';
import { AddressDirective } from './shared/address.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    AddressDirective,
  ],
  exports: [
    AddressDirective,
  ],
  providers: [
    AddressService,
    {
      provide: AddressStrategyAbstract,
      useClass: GooglePlacesStrategy,
      deps: [NgZone],
    },
  ],
})
export class AddressModule {

}
