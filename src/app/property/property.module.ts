import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { PropertyTableComponent } from './property-table/property-table.component';
import { PropertyTableHeaderComponent } from './property-table-header/property-table-header.component';
import { PropertyTableRowComponent } from './property-table-row/property-table-row.component';
import { PropertySearchlistComponent } from './property-searchlist/property-searchlist.component';
import { PropertyFormSearchComponent } from './property-form-search/property-form-search.component';
import { PropertyModalTransferComponent } from './property-modal-transfer/property-modal-transfer.component';
import { PropertyModalPublicationComponent } from './property-modal-publication/property-modal-publication.component';
import { PropertyModalRemoveMlsComponent } from './property-modal-remove-mls/property-modal-remove-mls.component';
import { PropertyModalMortgageComponent } from './property-modal-mortgage/property-modal-mortgage.component';
import { PropertyModalValuationComponent } from './property-modal-valuation/property-modal-valuation.component';
import { PropertyModalBrochureComponent } from './property-modal-brochure/property-modal-brochure.component';
import { PropertyPageListComponent } from './property-page-list/property-page-list.component';
import { HistoryModule } from '../history/history.module';
import { PropertyModalPolygonComponent } from './property-modal-polygon/property-modal-polygon.component';

@NgModule({
  imports: [
    SharedModule,
    HistoryModule,
  ],
  declarations: [
    PropertyTableComponent,
    PropertyTableHeaderComponent,
    PropertyTableRowComponent,
    PropertySearchlistComponent,
    PropertyModalTransferComponent,
    PropertyModalPublicationComponent,
    PropertyModalRemoveMlsComponent,
    PropertyModalMortgageComponent,
    PropertyModalValuationComponent,
    PropertyModalBrochureComponent,
    PropertyFormSearchComponent,
    PropertyPageListComponent,
    PropertyModalPolygonComponent,
  ],
  exports: [
    PropertyTableComponent,
    PropertyTableHeaderComponent,
    PropertyTableRowComponent,
    PropertySearchlistComponent,
    PropertyModalTransferComponent,
    PropertyModalPublicationComponent,
    PropertyModalRemoveMlsComponent,
    PropertyModalMortgageComponent,
    PropertyModalValuationComponent,
    PropertyModalBrochureComponent,
    PropertyPageListComponent,
    PropertyModalPolygonComponent,
  ],
})
export class PropertyModule {

}
