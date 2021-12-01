import { Component } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { SectorModel } from '../../shared/model/sector.model';

@Component({
  selector: 'app-sector-table',
  templateUrl: './sector-table.component.html',
  styleUrls: ['./sector-table.component.scss'],
})
export class SectorTableComponent extends TableComponentAbstract<SectorModel> {

}
