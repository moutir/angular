import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';

import { PageEffects } from './effects/page.effects';
import { SearchlistEffects } from './effects/searchlist.effects';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([PageEffects, SearchlistEffects]),
  ],
})
export class UiContractModule {

}
