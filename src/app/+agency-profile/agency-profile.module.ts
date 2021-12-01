import { NgModule } from '@angular/core';

import { AgencyProfileGeneralDocumentListComponent } from './agency-profile-general-document-list/agency-profile-general-document-list.component';
import { AgencyProfileImageDocumentListComponent } from './agency-profile-image-document-list/agency-profile-image-document-list.component';
import { SharedModule } from '../shared/shared.module';
import { AgencyProfileComponent } from './agency-profile.component';
import { AgencyProfileRoutingModule } from './agency-profile-routing.module';
import { AgencyProfilePageWriteComponent } from './agency-profile-page-write/agency-profile-page-write.component';
import { AgencyProfilePageReadComponent } from './agency-profile-page-read/agency-profile-page-read.component';
import { DocumentModule } from '../document/document.module';
import { GalleryModule } from '../gallery/gallery.module';
import { AgencyProfileFormProfileComponent } from './agency-profile-form-profile/agency-profile-form-profile.component';
import { AgencyProfileFormImagesComponent } from './agency-profile-form-images/agency-profile-form-images.component';
import { AgencyProfileModalPreviewComponent } from './agency-profile-modal-preview/agency-profile-modal-preview.component';

@NgModule({
  imports: [
    SharedModule,
    DocumentModule,
    GalleryModule,
    AgencyProfileRoutingModule,
  ],
  declarations: [
    AgencyProfileComponent,
    AgencyProfileFormProfileComponent,
    AgencyProfileFormImagesComponent,
    AgencyProfilePageWriteComponent,
    AgencyProfilePageReadComponent,
    AgencyProfileGeneralDocumentListComponent,
    AgencyProfileImageDocumentListComponent,
    AgencyProfileModalPreviewComponent,
  ],
})
export class AgencyProfileModule {

}
