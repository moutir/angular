import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ElementZoneStrategyFactory } from 'elements-zone-strategy';

import { PromotionModule } from '../app/promotion/promotion.module';
import { PromotionPageListComponent } from '../app/promotion/promotion-page-list/promotion-page-list.component';

@NgModule({
  imports: [
    PromotionModule,
  ],
  entryComponents: [
    PromotionPageListComponent,
  ],
})
export class PromotionElementsModule {

  /**
   * Constructor
   */
  constructor(
    private injector: Injector,
  ) {

    customElements
      .define('elements-promotion-page-list', createCustomElement(PromotionPageListComponent, {
        injector: this.injector,
        strategyFactory: new ElementZoneStrategyFactory(PromotionPageListComponent, this.injector),
      }));
  }
}
