import { Component, Input } from '@angular/core';

import { SectorModel } from '../../shared/model/sector.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { ModelAbstract } from '../../shared/class/model.abstract';

@Component({
  selector: 'app-sector-table-row',
  templateUrl: './sector-table-row.component.html',
  styleUrls: ['./sector-table-row.component.scss'],
})
export class SectorTableRowComponent extends TableRowComponentAbstract {

  /**
   * Sector to display
   */
  @Input() sector: SectorModel = new SectorModel();

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.sector;
  }
}
