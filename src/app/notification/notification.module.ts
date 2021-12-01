import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

import { NotificationComponent } from './notification/notification.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    NotificationComponent,
  ],
  exports: [
    NotificationComponent,
  ],
})
export class NotificationModule {

}
