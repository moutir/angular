import { Component, Input } from '@angular/core';

import { SuggestionModel } from '../../shared/model/suggestion.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { ModelAbstract } from '../../shared/class/model.abstract';

@Component({
  selector: 'app-suggestion-table-row',
  templateUrl: './suggestion-table-row.component.html',
  styleUrls: ['./suggestion-table-row.component.scss'],
})
export class SuggestionTableRowComponent extends TableRowComponentAbstract {

  /**
   * Suggestion to display
   */
  @Input() suggestion: SuggestionModel = new SuggestionModel();

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.suggestion;
  }
}
