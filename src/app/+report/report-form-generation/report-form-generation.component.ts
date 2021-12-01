import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { ReportGenerationOptionsInterface } from '../../shared/interface/report-generation-options.interface';
import { ReportGenerationModel } from '../../shared/model/report-generation.model';
import { ReportTypeEnum } from '../../shared/enum/report-type.enum';
import { ReportActionEnum } from '../../shared/enum/report-action.enum';
import { ReportGenerationModelAdapterStrategy } from '../../core/shared/report/report-generation-model-adapter.strategy';
import { PermissionEnum } from '../../shared/enum/permission.enum';

@Component({
  selector: 'app-report-form-generation',
  templateUrl: './report-form-generation.component.html',
  styleUrls: ['./report-form-generation.component.scss'],
})
export class ReportFormGenerationComponent extends FormComponentAbstract<
  ReportGenerationModel,
  ReportGenerationOptionsInterface
> {

  /**
   * Report generation model
   */
  @Input() model: ReportGenerationModel;

  /**
   * Generation form options
   */
  @Input() options: ReportGenerationOptionsInterface;

  /**
   *  List of permissions granted
   */
  @Input() permissions: PermissionEnum[];

  /**
   * Report action
   */
  @Input() action: ReportActionEnum;

  /**
   * Report type
   */
  @Input() reportType: ReportTypeEnum;

  /**
   * Report action names
   */
  actionSchedule: ReportActionEnum = ReportActionEnum.schedule;

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: ReportGenerationModelAdapterStrategy,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * @inheritDoc
   */
  protected updateControls(): void {

    super.updateControls();

    const options = { emitEvent: false };

    // No task read permission
    if (this.permissions.indexOf(PermissionEnum.taskRead) === -1) {

      const fields = ['offers', 'time', 'sending', 'pastVisits', 'nextVisits', 'communications'];

      fields.forEach(field => this.formGroup.get(field).disable(options));
    }

    // No lead read permission
    if (this.permissions.indexOf(PermissionEnum.leadRead) === -1) {

      this.formGroup.get('leads').disable(options);
    }

    // No agency marketing read permission
    if (this.permissions.indexOf(PermissionEnum.agencyMarketingRead) === -1) {

      this.formGroup.get('marketingExpenses').disable(options);
    }
  }
}
