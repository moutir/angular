import { Component } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { RestrictionModel } from '../../shared/model/restriction.model';

@Component({
  selector: 'app-restriction-table',
  templateUrl: './restriction-table.component.html',
  styleUrls: ['./restriction-table.component.scss'],
})
export class RestrictionTableComponent extends TableComponentAbstract<RestrictionModel> {

}
