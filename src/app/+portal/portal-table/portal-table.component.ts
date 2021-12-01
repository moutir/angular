import { Component } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { PortalModel } from '../../shared/model/portal.model';

@Component({
  selector: 'app-portal-table',
  templateUrl: './portal-table.component.html',
})
export class PortalTableComponent extends TableComponentAbstract<PortalModel> {

}
