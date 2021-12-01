import { Component } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { MatchingModel } from '../../shared/model/matching.model';

@Component({
  selector: 'app-matching-table',
  templateUrl: './matching-table.component.html',
  styleUrls: ['./matching-table.component.scss'],
})
export class MatchingTableComponent extends TableComponentAbstract<MatchingModel> {

}
