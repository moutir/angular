import { Component } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { MlsModel } from '../../shared/model/mls.model';

@Component({
  selector: 'app-mls-table',
  templateUrl: './mls-table.component.html',
})
export class MlsTableComponent extends TableComponentAbstract<MlsModel> {

}
