import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { SuggestionComponent } from './suggestion.component';
import { SuggestionRoutingModule } from './suggestion-routing.module';
import { SuggestionFormSearchComponent } from './suggestion-form-search/suggestion-form-search.component';
import { SuggestionTableRowComponent } from './suggestion-table-row/suggestion-table-row.component';
import { SuggestionTableHeaderComponent } from './suggestion-table-header/suggestion-table-header.component';
import { SuggestionPageListComponent } from './suggestion-page-list/suggestion-page-list.component';
import { SuggestionPageWriteComponent } from './suggestion-page-write/suggestion-page-write.component';
import { SuggestionPageReadComponent } from './suggestion-page-read/suggestion-page-read.component';
import { SuggestionPageSearchComponent } from './suggestion-page-search/suggestion-page-search.component';
import { SuggestionSearchlistComponent } from './suggestion-searchlist/suggestion-searchlist.component';
import { SuggestionTableComponent } from './suggestion-table/suggestion-table.component';
import { SuggestionFormRequiredComponent } from './suggestion-form-required/suggestion-form-required.component';
import { GalleryModule } from '../gallery/gallery.module';

@NgModule({
  imports: [
    SharedModule,
    SuggestionRoutingModule,
    GalleryModule,
  ],
  declarations: [
    SuggestionComponent,
    SuggestionTableComponent,
    SuggestionTableHeaderComponent,
    SuggestionTableRowComponent,
    SuggestionSearchlistComponent,
    SuggestionFormSearchComponent,
    SuggestionFormRequiredComponent,
    SuggestionPageListComponent,
    SuggestionPageSearchComponent,
    SuggestionPageWriteComponent,
    SuggestionPageReadComponent,
  ],
})
export class SuggestionModule {

}
