import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FEATURE_NAME } from './state';
import { reducer } from './reducer';
import { SearchlistEffects } from './effects/searchlist.effects';
import { PageEffects } from './effects/page.effects';
import { EmailEffects } from './effects/email.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(FEATURE_NAME, reducer),
    EffectsModule.forFeature([PageEffects, SearchlistEffects, EmailEffects]),
  ],
})
export class UiEmailModule {

}
