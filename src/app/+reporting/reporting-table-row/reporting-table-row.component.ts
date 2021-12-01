import { Component, Input } from '@angular/core';

import { ReportingModel } from '../../shared/model/reporting.model';
import { ReportingService } from '../../core/shared/reporting/reporting.service';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeAuthenticationInterface } from '../../shared/interface/runtime-authentication.interface';
import { ModelAbstract } from '../../shared/class/model.abstract';

@Component({
  selector: 'app-reporting-table-row',
  templateUrl: './reporting-table-row.component.html',
  styleUrls: ['./reporting-table-row.component.scss'],
})
export class ReportingTableRowComponent extends TableRowComponentAbstract {

  /**
   * Report to display
   */
  @Input() reporting: ReportingModel = new ReportingModel();

  /**
   *  List of permissions granted
   */
  @Input() permissions: PermissionEnum[];

  /**
   *  Authentication
   */
  @Input() authentication: RuntimeAuthenticationInterface;

  /**
   * Constants
   */
  readonly PERMISSION_REPORTING_MANAGER: PermissionEnum = PermissionEnum.reportingManager;

  /**
   * Constructor
   */
  constructor(
    private reportService: ReportingService,
  ) {

    super();
  }

  /**
   * Clicked downolad button
   */
  onClickButtonDownload(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder report
    if (this.isPlaceholder) {

      return;
    }

    this.reportService.download(this.reporting.previewUrl);
  }

  /**
   * Clicked accept button
   */
  onClickButtonAccept(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder report
    if (this.isPlaceholder) {

      return;
    }

    this.reportService.accept([this.reporting.id]);
  }

  /**
   * Clicked reject button
   */
  onClickButtonReject(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder report
    if (this.isPlaceholder) {

      return;
    }

    this.reportService.reject([this.reporting.id]);
  }

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.reporting;
  }
}
