import { Component, Input } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { ReportModel } from '../../shared/model/report.model';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeFeatureReportInterface } from '../../shared/interface/runtime-feature-report.interface';
import { ReportTypeEnum } from '../../shared/enum/report-type.enum';
import { RuntimeAuthenticationInterface } from '../../shared/interface/runtime-authentication.interface';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss'],
})
export class ReportTableComponent extends TableComponentAbstract<ReportModel> {

  /**
   * Report type
   */
  @Input() reportType: ReportTypeEnum;

  /**
   * Permissions
   */
  @Input() permissions: PermissionEnum[] = [];

  /**
   *  Authentication
   */
  @Input() authentication: RuntimeAuthenticationInterface;

  /**
   * Report feature
   */
  @Input() featureReport: RuntimeFeatureReportInterface;
}
