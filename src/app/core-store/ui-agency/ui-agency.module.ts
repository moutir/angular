import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';

import { PageEffects } from './effects/page.effects';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([PageEffects]),
  ],
})
export class UiAgencyModule {

}
