import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormatNumberPipe } from './shared/format-number.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    FormatNumberPipe,
  ],
  exports: [
    FormatNumberPipe,
  ],
  providers: [
    FormatNumberPipe,
  ],
})
export class NumberModule {

}
