import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HistoryModule } from '../history/history.module';
import { DocumentModule } from '../document/document.module';
import { ContactComponent } from './contact.component';
import { ContactSearchlistComponent } from './contact-searchlist/contact-searchlist.component';
import { ContactTableComponent } from './contact-table/contact-table.component';
import { ContactTableRowComponent } from './contact-table-row/contact-table-row.component';
import { ContactTableHeaderComponent } from './contact-table-header/contact-table-header.component';
import { ContactFormSearchComponent } from './contact-form-search/contact-form-search.component';
import { ContactPageListComponent } from './contact-page-list/contact-page-list.component';
import { ContactModalModifyBrokerComponent } from './contact-modal-modify-broker/contact-modal-modify-broker.component';
import { ContactModalTransferComponent } from './contact-modal-transfer/contact-modal-transfer.component';
import { ContactModalTransferActivityComponent } from './contact-modal-transfer-activity/contact-modal-transfer-activity.component';
import { ContactDocumentListComponent } from './contact-document-list/contact-document-list.component';
import { ContactFormSearchBetaPerformanceComponent } from './contact-form-search-beta-performance/contact-form-search-beta-performance.component';

@NgModule({
  imports: [
    SharedModule,
    HistoryModule,
    DocumentModule,
  ],
  declarations: [
    ContactComponent,
    ContactPageListComponent,
    ContactSearchlistComponent,
    ContactTableHeaderComponent,
    ContactTableRowComponent,
    ContactTableComponent,
    ContactFormSearchComponent,
    ContactModalModifyBrokerComponent,
    ContactModalTransferComponent,
    ContactModalTransferActivityComponent,
    ContactDocumentListComponent,
    ContactFormSearchBetaPerformanceComponent,
  ],
  exports: [
    ContactSearchlistComponent,
    ContactTableHeaderComponent,
    ContactTableRowComponent,
    ContactTableComponent,
    ContactFormSearchComponent,
    ContactModalModifyBrokerComponent,
    ContactModalTransferComponent,
    ContactModalTransferActivityComponent,
    ContactFormSearchBetaPerformanceComponent,
  ],
})
export class ContactModule {

}
