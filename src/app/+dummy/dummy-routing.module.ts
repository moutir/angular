import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DummyDocumentPageComponent } from './dummy-document-page/dummy-document-page.component';
import { DummyGalleryPageComponent } from './dummy-gallery-page/dummy-gallery-page.component';
import { DummyPolygonPageComponent } from './dummy-polygon-page/dummy-polygon-page.component';
import { DummyAddressPageComponent } from './dummy-address-page/dummy-address-page.component';
import { DummyPageComponent } from './dummy-page/dummy-page.component';

const routes: Routes = [
  {
    path: 'document',
    component: DummyDocumentPageComponent,
  },
  {
    path: 'gallery',
    component: DummyGalleryPageComponent,
  },
  {
    path: 'polygon',
    component: DummyPolygonPageComponent,
  },
  {
    path: 'address',
    component: DummyAddressPageComponent,
  },
  {
    path: '**',
    component: DummyPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DummyRoutingModule {

}
