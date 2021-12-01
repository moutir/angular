import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FEATURE_NAME } from './state';
import { reducer } from './reducer';
import { SearchlistEffects } from './effects/searchlist.effects';
import { PageEffects } from './effects/page.effects';
import { EmailTemplateEffects } from './effects/email-template.effects';

@NgModule({
  imports: [
  CommonModule,
    StoreModule.forFeature(FEATURE_NAME, reducer),
    EffectsModule.forFeature([PageEffects, SearchlistEffects, EmailTemplateEffects]),
  ],
})
export class UiEmailTemplateModule {

}
