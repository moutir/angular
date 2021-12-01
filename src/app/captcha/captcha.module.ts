import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ReactiveFormsModule } from '@angular/forms';

import { CaptchaComponent } from './captcha/captcha.component';

@NgModule({
  imports: [
    CommonModule,
    NgxCaptchaModule,
    ReactiveFormsModule,
  ],
  declarations: [
    CaptchaComponent,
  ],
  exports: [
    CaptchaComponent,
  ],
})
export class CaptchaModule {

}
