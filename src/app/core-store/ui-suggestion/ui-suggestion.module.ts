import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { FEATURE_NAME } from './state';
import { reducer } from './reducer';
import { PageEffects } from './effects/page.effects';
import { SearchlistEffects } from './effects/searchlist.effects';
import { SuggestionEffects } from './effects/suggestion.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(FEATURE_NAME, reducer),
    EffectsModule.forFeature([SuggestionEffects, PageEffects, SearchlistEffects]),
  ],
})
export class UiSuggestionModule {

}
