import { Component, Input } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { ReportingModel } from '../../shared/model/reporting.model';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeAuthenticationInterface } from '../../shared/interface/runtime-authentication.interface';

@Component({
  selector: 'app-reporting-table',
  templateUrl: './reporting-table.component.html',
  styleUrls: ['./reporting-table.component.scss'],
})
export class ReportingTableComponent extends TableComponentAbstract<ReportingModel> {

  /**
   * Permissions
   */
  @Input() permissions: PermissionEnum[] = [];

  /**
   *  Authentication
   */
  @Input() authentication: RuntimeAuthenticationInterface;

}
