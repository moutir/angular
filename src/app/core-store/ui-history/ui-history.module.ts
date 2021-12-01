import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FEATURE_NAME } from './state';
import { reducer } from './reducer';
import { HistoryEffects } from './effects/history.effects';

@NgModule({
  imports: [
  CommonModule,
    StoreModule.forFeature(FEATURE_NAME, reducer),
    EffectsModule.forFeature([HistoryEffects]),
  ],
})
export class UiHistoryModule {

}
