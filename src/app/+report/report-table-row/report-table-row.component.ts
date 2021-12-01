import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ReportModel } from '../../shared/model/report.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeAuthenticationInterface } from '../../shared/interface/runtime-authentication.interface';
import { ModelAbstract } from '../../shared/class/model.abstract';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { ReportService } from '../../core/shared/report/report.service';
import { RuntimeFeatureReportInterface } from '../../shared/interface/runtime-feature-report.interface';
import { ReportTypeEnum } from '../../shared/enum/report-type.enum';

@Component({
  selector: 'app-report-table-row',
  templateUrl: './report-table-row.component.html',
  styleUrls: ['./report-table-row.component.scss'],
})
export class ReportTableRowComponent extends TableRowComponentAbstract implements OnChanges {

  /**
   * Report to display
   */
  @Input() report: ReportModel = new ReportModel();

  /**
   * Report type
   */
  @Input() reportType: ReportTypeEnum;

  /**
   *  List of permissions granted
   */
  @Input() permissions: PermissionEnum[];

  /**
   * Report feature
   */
  @Input() featureReport: RuntimeFeatureReportInterface;

  /**
   *  Authentication
   */
  @Input() authentication: RuntimeAuthenticationInterface;

  /**
   * Tooltip text for email action and checkbox (not translated)
   */
  actionTooltip: string;

  /**
   * Maximum number of contacts
   */
  contactMax: number = 3;

  /**
   * Constructor
   */
  constructor(
    private runtimeService: RuntimeService,
    private reportService: ReportService,
  ) {

    super();
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.report || changes.reportType || changes.permissions || changes.authentication) {

      this.actionTooltip = this.getActionTooltip();
    }
  }

  /**
   * Return the tooltip's translation key for email action and checkbox
   */
  getActionTooltip(): string {

    if (
      this.reportService.hasPermissionUpdate(
        this.reportType,
        this.report,
        this.permissions,
        this.authentication) === false
    ) {

      return 'label_readonly_permission';
    }

    if (this.report.hasEmail === false) {

      return 'label_no_email_contact';
    }

    return '';
  }

  /**
   * Clicked brochure button
   */
  onClickButtonBrochure(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder
    if (this.isPlaceholder) {

      return;
    }

    this.reportService.openBrochureMenu(this.report.id, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  /**
   * Clicked on thumbnail
   */
  onClickThumbnail(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder
    if (this.isPlaceholder) {

      return;
    }

    this.runtimeService.previewImage(this.report.property.photoLargeURL, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.report;
  }
}
