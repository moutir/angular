import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { WebsiteRoutingModule } from './website-routing.module';
import { WebsiteComponent } from './website.component';
import { WebsiteFormSearchComponent } from './website-form-search/website-form-search.component';
import { WebsiteTableRowComponent } from './website-table-row/website-table-row.component';
import { WebsiteTableHeaderComponent } from './website-table-header/website-table-header.component';
import { WebsitePageListComponent } from './website-page-list/website-page-list.component';
import { WebsiteSearchlistComponent } from './website-searchlist/website-searchlist.component';
import { WebsiteTableComponent } from './website-table/website-table.component';
import { WebsitePageReadComponent } from './website-page-read/website-page-read.component';
import { WebsiteFormGeneralComponent } from './website-form-general/website-form-general.component';
import { WebsitePageWriteComponent } from './website-page-write/website-page-write.component';
import { WebsiteFormContentComponent } from './website-form-content/website-form-content.component';
import { WebsiteDocumentListComponent } from './website-document-list/website-document-list.component';
import { DocumentModule } from '../document/document.module';
import { GalleryModule } from '../gallery/gallery.module';
import { WebsiteFormStyleComponent } from './website-form-style/website-form-style.component';

@NgModule({
  imports: [
    SharedModule,
    DocumentModule,
    GalleryModule,
    WebsiteRoutingModule,
  ],
  declarations: [
    WebsiteComponent,
    WebsiteTableComponent,
    WebsiteTableHeaderComponent,
    WebsiteTableRowComponent,
    WebsiteSearchlistComponent,
    WebsiteFormSearchComponent,
    WebsitePageListComponent,
    WebsitePageReadComponent,
    WebsiteFormGeneralComponent,
    WebsiteFormStyleComponent,
    WebsiteFormContentComponent,
    WebsitePageWriteComponent,
    WebsiteDocumentListComponent,
  ],
})
export class WebsiteModule {

}
