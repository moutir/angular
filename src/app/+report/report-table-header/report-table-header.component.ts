import { Component, Input } from '@angular/core';
import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';
import { RuntimeFeatureReportInterface } from '../../shared/interface/runtime-feature-report.interface';

@Component({
  selector: 'app-report-table-header',
  templateUrl: './report-table-header.component.html',
  styleUrls: ['./report-table-header.component.scss'],
})
export class ReportTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Report feature
   */
  @Input() featureReport: RuntimeFeatureReportInterface;

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
