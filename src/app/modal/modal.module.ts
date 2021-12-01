import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { ModalHeaderComponent } from './modal-header/modal-header.component';
import { ModalFooterComponent } from './modal-footer/modal-footer.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),

    // Material modules
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [
    ModalConfirmComponent,
    ModalHeaderComponent,
    ModalFooterComponent,
  ],
  exports: [
    ModalConfirmComponent,
    ModalHeaderComponent,
    ModalFooterComponent,
  ],
})
export class ModalModule {

}
