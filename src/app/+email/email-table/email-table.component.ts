import { Component } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { EmailModel } from '../../shared/model/email.model';

@Component({
  selector: 'app-email-table',
  templateUrl: './email-table.component.html',
  styleUrls: ['./email-table.component.scss'],
})
export class EmailTableComponent extends TableComponentAbstract<EmailModel> {

}
