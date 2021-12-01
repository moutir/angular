import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { WebsiteArticleComponent } from './website-article.component';
import { WebsiteArticleRoutingModule } from './website-article-routing.module';
import { WebsiteArticleTableRowComponent } from './website-article-table-row/website-article-table-row.component';
import { WebsiteArticleTableHeaderComponent } from './website-article-table-header/website-article-table-header.component';
import { WebsiteArticlePageListComponent } from './website-article-page-list/website-article-page-list.component';
import { WebsiteArticlePageWriteComponent } from './website-article-page-write/website-article-page-write.component';
import { WebsiteArticlePageReadComponent } from './website-article-page-read/website-article-page-read.component';
import { WebsiteArticleSearchlistComponent } from './website-article-searchlist/website-article-searchlist.component';
import { WebsiteArticleTableComponent } from './website-article-table/website-article-table.component';
import { WebsiteArticleFormGeneralComponent } from './website-article-form-general/website-article-form-general.component';
import { WebsiteArticleDocumentListComponent } from './website-article-document-list/website-article-document-list.component';
import { WebsiteArticleFormContentComponent } from './website-article-form-content/website-article-form-content.component';
import { DocumentModule } from '../document/document.module';
import { GalleryModule } from '../gallery/gallery.module';

@NgModule({
  imports: [
    SharedModule,
    DocumentModule,
    GalleryModule,
    WebsiteArticleRoutingModule,
  ],
  declarations: [
    WebsiteArticleComponent,
    WebsiteArticleTableComponent,
    WebsiteArticleTableHeaderComponent,
    WebsiteArticleTableRowComponent,
    WebsiteArticleSearchlistComponent,
    WebsiteArticleFormGeneralComponent,
    WebsiteArticleFormContentComponent,
    WebsiteArticlePageListComponent,
    WebsiteArticlePageWriteComponent,
    WebsiteArticlePageReadComponent,
    WebsiteArticleDocumentListComponent,
  ],
})
export class WebsiteArticleModule {

}
