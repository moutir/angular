import { Component } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { SuggestionModel } from '../../shared/model/suggestion.model';

@Component({
  selector: 'app-suggestion-table',
  templateUrl: './suggestion-table.component.html',
  styleUrls: ['./suggestion-table.component.scss'],
})
export class SuggestionTableComponent extends TableComponentAbstract<SuggestionModel> {

}
