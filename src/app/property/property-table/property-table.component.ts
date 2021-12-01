import { Component, Input } from '@angular/core';

import { PropertyModel } from '../../shared/model/property.model';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { RuntimeFeaturePriceInterface } from '../../shared/interface/runtime-feature-price.interface';
import { ListTypeEnum } from '../../shared/enum/list-type.enum';

@Component({
  selector: 'app-property-table',
  templateUrl: './property-table.component.html',
  styleUrls: ['./property-table.component.scss'],
})
export class PropertyTableComponent extends TableComponentAbstract<PropertyModel> {

  /**
   * Feature
   */
  @Input() feature: RuntimeFeatureInterface;

  /**
   * Feature price
   */
  @Input() featurePrice: RuntimeFeaturePriceInterface;

  /**
   * Permissions
   */
  @Input() permissions: PermissionEnum[] = [];

  /**
   * Property list type
   */
  @Input() listType: ListTypeEnum;

}
