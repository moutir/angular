import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FEATURE_NAME } from './state';
import { reducer } from './reducer';
import { PromotionEffects } from './effects/promotion.effects';
import { SearchlistEffects } from './effects/searchlist.effects';
import { PageEffects } from './effects/page.effects';

@NgModule({
  imports: [
  CommonModule,
    StoreModule.forFeature(FEATURE_NAME, reducer),
    EffectsModule.forFeature([PromotionEffects, PageEffects, SearchlistEffects]),
  ],
})
export class UiPromotionModule {

}
