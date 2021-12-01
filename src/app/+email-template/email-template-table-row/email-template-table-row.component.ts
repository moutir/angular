import { Component, Input } from '@angular/core';

import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { EmailTemplateModel } from '../../shared/model/email-template.model';

@Component({
  selector: 'app-email-template-table-row',
  templateUrl: './email-template-table-row.component.html',
  styleUrls: ['./email-template-table-row.component.scss'],
})
export class EmailTemplateTableRowComponent extends TableRowComponentAbstract {

  /**
   * Email template to display
   */
  @Input() emailTemplate: EmailTemplateModel = new EmailTemplateModel();

  /**
   * Current language label
   */
  @Input() currentLanguageLabel: string = '';

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  /**
   * @inheritDoc
   */
  protected getModel(): EmailTemplateModel {

    return this.emailTemplate;
  }

}
