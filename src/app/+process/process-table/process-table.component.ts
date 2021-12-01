import { Component } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { ProcessModel } from '../../shared/model/process.model';

@Component({
  selector: 'app-process-table',
  templateUrl: './process-table.component.html',
  styleUrls: ['./process-table.component.scss'],
})
export class ProcessTableComponent extends TableComponentAbstract<ProcessModel> {

}
