import { Component } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { LeadModel } from '../../shared/model/lead.model';

@Component({
  selector: 'app-lead-table',
  templateUrl: './lead-table.component.html',
  styleUrls: ['./lead-table.component.scss'],
})
export class LeadTableComponent extends TableComponentAbstract<LeadModel> {

}
