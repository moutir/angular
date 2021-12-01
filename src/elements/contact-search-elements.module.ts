import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ElementZoneStrategyFactory } from 'elements-zone-strategy';

import { ContactSearchModule } from '../app/contact-search/contact-search.module';
import { ContactSearchMapComponent } from '../app/contact-search/contact-search-map/contact-search-map.component';

@NgModule({
  imports: [
    ContactSearchModule,
  ],
  entryComponents: [
    ContactSearchMapComponent,
  ],
})
export class ContactSearchElementsModule {

  /**
   * Constructor
   */
  constructor(
    private injector: Injector,
  ) {

    customElements
      .define('elements-contact-search-map', createCustomElement(ContactSearchMapComponent, {
        injector: this.injector,
        strategyFactory: new ElementZoneStrategyFactory(ContactSearchMapComponent, this.injector),
      }));
  }
}
