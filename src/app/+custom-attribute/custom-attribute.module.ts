import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material';

import { SharedModule } from '../shared/shared.module';
import { CustomAttributeComponent } from './custom-attribute.component';
import { CustomAttributeRoutingModule } from './custom-attribute-routing.module';
import { CustomAttributeFormSearchComponent } from './custom-attribute-form-search/custom-attribute-form-search.component';
import { CustomAttributeTableRowComponent } from './custom-attribute-table-row/custom-attribute-table-row.component';
import { CustomAttributeTableHeaderComponent } from './custom-attribute-table-header/custom-attribute-table-header.component';
import { CustomAttributePageListComponent } from './custom-attribute-page-list/custom-attribute-page-list.component';
import { CustomAttributePageWriteComponent } from './custom-attribute-page-write/custom-attribute-page-write.component';
import { CustomAttributePageReadComponent } from './custom-attribute-page-read/custom-attribute-page-read.component';
import { CustomAttributePageSearchComponent } from './custom-attribute-page-search/custom-attribute-page-search.component';
import { CustomAttributeSearchlistComponent } from './custom-attribute-searchlist/custom-attribute-searchlist.component';
import { CustomAttributeTableComponent } from './custom-attribute-table/custom-attribute-table.component';
import { CustomAttributeFormRequiredComponent } from './custom-attribute-form-required/custom-attribute-form-required.component';
import { PropertyModule } from '../property/property.module';
import { PromotionModule } from '../promotion/promotion.module';
import { ContactModule } from '../contact/contact.module';

@NgModule({
  imports: [
    SharedModule,
    CustomAttributeRoutingModule,
    PropertyModule,
    PromotionModule,
    ContactModule,
    MatListModule,
  ],
  declarations: [
    CustomAttributeComponent,
    CustomAttributeTableComponent,
    CustomAttributeTableHeaderComponent,
    CustomAttributeTableRowComponent,
    CustomAttributeSearchlistComponent,
    CustomAttributeFormSearchComponent,
    CustomAttributeFormRequiredComponent,
    CustomAttributePageListComponent,
    CustomAttributePageSearchComponent,
    CustomAttributePageWriteComponent,
    CustomAttributePageReadComponent,
  ],
})
export class CustomAttributeModule {

}
