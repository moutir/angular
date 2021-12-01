import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { DocumentManagerComponent } from './document-manager/document-manager.component';
import { DocumentComponent } from './document/document.component';
import { DocumentModelAdapterStrategy } from './shared/document-model-adapter.strategy';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    DocumentManagerComponent,
    DocumentComponent,
  ],
  exports: [
    DocumentManagerComponent,
    DocumentComponent,
  ],
  providers: [
    DocumentModelAdapterStrategy,
  ],
})
export class DocumentModule {

}
