import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';

import { PageEffects } from './effects/page.effects';
import { SearchlistEffects } from './effects/searchlist.effects';
import { CustomAttributeEffects } from './effects/custom-attribute.effects';

@NgModule({
  imports: [
CommonModule,
    EffectsModule.forFeature([CustomAttributeEffects, PageEffects, SearchlistEffects]),
  ],
})
export class UiCustomAttributeModule {

}
