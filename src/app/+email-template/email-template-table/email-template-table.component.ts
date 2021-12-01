import { Component, Input } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { EmailTemplateModel } from '../../shared/model/email-template.model';

@Component({
  selector: 'app-email-template-table',
  templateUrl: './email-template-table.component.html',
})
export class EmailTemplateTableComponent extends TableComponentAbstract<EmailTemplateModel> {

  /**
   * Current language label
   */
  @Input() currentLanguageLabel: string = '';
}
