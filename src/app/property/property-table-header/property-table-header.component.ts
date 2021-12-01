import { Component, Input } from '@angular/core';

import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';
import { ListTypeEnum } from '../../shared/enum/list-type.enum';

@Component({
  selector: 'app-property-table-header',
  templateUrl: './property-table-header.component.html',
  styleUrls: ['./property-table-header.component.scss'],
})
export class PropertyTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Property list type
   */
  @Input() listType: ListTypeEnum;

  /**
   * Property list types
   */
  listTypeSell: ListTypeEnum = ListTypeEnum.sell;
  listTypeRent: ListTypeEnum = ListTypeEnum.rent;
  listTypeBasket: ListTypeEnum = ListTypeEnum.basket;
}
