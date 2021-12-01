import { Component, Input } from '@angular/core';

import { CustomAttributeModel } from '../../shared/model/custom-attribute.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { ModelAbstract } from '../../shared/class/model.abstract';
import { CustomAttributeTypeEnum } from '../../shared/enum/custom-attribute-type.enum';

@Component({
  selector: 'app-custom-attribute-table-row',
  templateUrl: './custom-attribute-table-row.component.html',
  styleUrls: ['./custom-attribute-table-row.component.scss'],
})
export class CustomAttributeTableRowComponent extends TableRowComponentAbstract {

  /**
   * Custom attribute to display
   */
  @Input() customAttribute: CustomAttributeModel = new CustomAttributeModel();

  /**
   * Constants
   */
  readonly TYPE_PROPERTY: CustomAttributeTypeEnum = CustomAttributeTypeEnum.property;
  readonly TYPE_PROMOTION: CustomAttributeTypeEnum = CustomAttributeTypeEnum.promotion;
  readonly TYPE_CONTACT: CustomAttributeTypeEnum = CustomAttributeTypeEnum.contact;

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.customAttribute;
  }
}
