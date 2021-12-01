import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ElementZoneStrategyFactory } from 'elements-zone-strategy';

import { PropertyModule } from '../app/property/property.module';
import { PropertyPageListComponent } from '../app/property/property-page-list/property-page-list.component';

@NgModule({
  imports: [
    PropertyModule,
  ],
  entryComponents: [
    PropertyPageListComponent,
  ],
})
export class PropertyElementsModule {

  /**
   * Constructor
   */
  constructor(
    private injector: Injector,
  ) {

    customElements
      .define('elements-property-page-list', createCustomElement(PropertyPageListComponent, {
        injector: this.injector,
        strategyFactory: new ElementZoneStrategyFactory(PropertyPageListComponent, this.injector),
      }));
  }
}
