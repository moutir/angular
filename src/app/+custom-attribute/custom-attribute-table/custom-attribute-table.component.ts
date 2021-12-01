import { Component } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { CustomAttributeModel } from '../../shared/model/custom-attribute.model';

@Component({
  selector: 'app-custom-attribute-table',
  templateUrl: './custom-attribute-table.component.html',
  styleUrls: ['./custom-attribute-table.component.scss'],
})
export class CustomAttributeTableComponent extends TableComponentAbstract<CustomAttributeModel> {

}
