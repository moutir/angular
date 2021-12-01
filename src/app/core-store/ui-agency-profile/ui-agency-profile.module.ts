import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FEATURE_NAME } from './state';
import { reducer } from './reducer';
import { PageEffects } from './effects/page.effects';
import { GeneralDocumentEffects } from './effects/general-document.effects';
import { ImageDocumentEffects } from './effects/image-document.effects';
import { AgencyProfileEffects } from './effects/agency-profile.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(FEATURE_NAME, reducer),
    EffectsModule.forFeature([AgencyProfileEffects, PageEffects, GeneralDocumentEffects, ImageDocumentEffects]),
  ],
})
export class UiAgencyProfileModule {

}
