import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material';
import { ColorPickerModule as ColorPickModule } from 'ngx-color-picker';

import { ColorPickerComponent } from '../shared/component/color-picker/color-picker.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ColorPickModule,
    MatTooltipModule,
  ],
  declarations: [
    ColorPickerComponent,
  ],
  exports: [
    ColorPickerComponent,
  ],
})
export class ColorPickerModule {

}
