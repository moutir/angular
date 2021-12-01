import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FEATURE_NAME } from './state';
import { reducer } from './reducer';
import { UserEffects } from './effects/user.effects';
import { PageEffects } from './effects/page.effects';
import { DocumentEffects } from './effects/document.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(FEATURE_NAME, reducer),
    EffectsModule.forFeature([UserEffects, PageEffects, DocumentEffects]),
  ],
})
export class UiUserModule {

}
