import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ElementZoneStrategyFactory } from 'elements-zone-strategy';

import { ContactModule } from '../app/contact/contact.module';
import { ContactPageListComponent } from '../app/contact/contact-page-list/contact-page-list.component';

@NgModule({
  imports: [
    ContactModule,
  ],
  entryComponents: [
    ContactPageListComponent,
  ],
})
export class ContactElementsModule {

  /**
   * Constructor
   */
  constructor(
    private injector: Injector,
  ) {

    customElements
      .define('elements-contact-page-list', createCustomElement(ContactPageListComponent, {
        injector: this.injector,
        strategyFactory: new ElementZoneStrategyFactory(ContactPageListComponent, this.injector),
      }));
  }
}
