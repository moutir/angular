import { Component, Input } from '@angular/core';

import { PromotionModel } from '../../shared/model/promotion.model';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';

@Component({
  selector: 'app-promotion-table',
  templateUrl: './promotion-table.component.html',
  styleUrls: ['./promotion-table.component.scss'],
})
export class PromotionTableComponent extends TableComponentAbstract<PromotionModel> {

  /**
   * Feature
   */
  @Input() feature: RuntimeFeatureInterface;

  /**
   * Permissions
   */
  @Input() permissions: PermissionEnum[] = [];

}
