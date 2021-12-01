import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { DummyRoutingModule } from './dummy-routing.module';
import { DummyDocumentPageComponent } from './dummy-document-page/dummy-document-page.component';
import { DummyGalleryPageComponent } from './dummy-gallery-page/dummy-gallery-page.component';
import { DocumentModule } from '../document/document.module';
import { GalleryModule } from '../gallery/gallery.module';
import { DummyPolygonPageComponent } from './dummy-polygon-page/dummy-polygon-page.component';
import { DummyAddressPageComponent } from './dummy-address-page/dummy-address-page.component';
import { AddressModule } from '../address/address.module';
import { DummyPageComponent } from './dummy-page/dummy-page.component';
import { ContactModule } from '../contact/contact.module';

@NgModule({
  imports: [
    SharedModule,
    DummyRoutingModule,
    DocumentModule,
    GalleryModule,
    AddressModule,
    ContactModule,
  ],
  declarations: [
    DummyPageComponent,
    DummyDocumentPageComponent,
    DummyGalleryPageComponent,
    DummyPolygonPageComponent,
    DummyAddressPageComponent,
  ],
  providers: [],
})
export class DummyModule {

}
