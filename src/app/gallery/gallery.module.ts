import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { GalleryComponent } from './gallery/gallery.component';
import { GalleryModalComponent } from './gallery-modal/gallery-modal.component';
import { GalleryService } from './shared/gallery.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    GalleryComponent,
    GalleryModalComponent,
  ],
  exports: [
    GalleryComponent,
    GalleryModalComponent,
  ],
  providers: [
    GalleryService,
  ],
})
export class GalleryModule {

}
