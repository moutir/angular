import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { UserPageWriteComponent } from './user-page-write/user-page-write.component';
import { UserDocumentListComponent } from './user-document-list/user-document-list.component';
import { DocumentModule } from '../document/document.module';

@NgModule({
  imports: [
    SharedModule,
    UserRoutingModule,
    DocumentModule,
  ],
  declarations: [
    UserComponent,
    UserPageWriteComponent,
    UserDocumentListComponent,
  ],
})
export class UserModule {

}
