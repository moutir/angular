import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { ReportGenerationInterface } from '../../shared/interface/report-generation.interface';
import { ReportGenerationOptionsInterface } from '../../shared/interface/report-generation-options.interface';
import { ReportModel } from '../../shared/model/report.model';
import { ChangeFormEventInterface } from '../../shared/interface/change-form-event.interface';
import { ReportGenerationModel } from '../../shared/model/report-generation.model';
import { ReportActionEnum } from '../../shared/enum/report-action.enum';
import { ErrorFormEventInterface } from '../../shared/interface/error-form-event.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { Dictionary } from '../../shared/class/dictionary';

@Component({
  selector: 'app-report-modal-generation',
  templateUrl: './report-modal-generation.component.html',
  styleUrls: ['./report-modal-generation.component.scss'],
})
export class ReportModalGenerationComponent
  extends ModalComponentAbstract<ReportGenerationInterface> implements OnChanges {

  /**
   * Report generation state
   */
  @Input() generation: ReportGenerationInterface;

  /**
   * Report generation form options
   */
  @Input() options: ReportGenerationOptionsInterface;

  /**
   * Report model
   */
  @Input() report: ReportModel;

  /**
   * Dictionary of error messages
   */
  @Input() error: Dictionary<string|null> = {};

  /**
   *  List of permissions granted
   */
  @Input() permissions: PermissionEnum[];

  /**
   * Has update permission?
   */
  @Input() hasPermissionUpdate: boolean = false;

  /**
   * Changed form input and model
   */
  @Output() changeForm: EventEmitter<ChangeFormEventInterface<ReportGenerationModel>> =
    new EventEmitter<ChangeFormEventInterface<ReportGenerationModel>>();

  /**
   * Validation error
   */
  @Output() errorForm: EventEmitter<ErrorFormEventInterface> = new EventEmitter<ErrorFormEventInterface>();

  /**
   * Report action names
   */
  actionDownload: ReportActionEnum = ReportActionEnum.download;
  actionSchedule: ReportActionEnum = ReportActionEnum.schedule;
  actionSend: ReportActionEnum = ReportActionEnum.send;

  /**
   * Error message
   */
  errorMessage: string = '';

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    this.errorMessage = '';

    if (this.isVisible === false || this.generation.action !== this.actionSchedule) {

      return;
    }

    if (!this.report.contact.id) {

      this.errorMessage = 'label_not_available_contact';
    }

    if (this.report.contact.emails.length === 0) {

      this.errorMessage = 'label_no_email_contact';
    }

    if (Object.keys(this.error).some(key => !!this.error[key])) {

      this.errorMessage = 'notification_fix_form_errors';
    }
  }

  /**
   * @inheritDoc
   */
  onClickButton(isValid: boolean): void {

    // Emit event
    this.submitModal.emit({
      isValid: isValid,
      data: {
        ...this.generation,
        step: isValid ? this.generation.step + 1 : 0,
      },
    });
  }

  /**
   * Clicked on scheduler button
   */
  onClickButtonScheduler(isActionActivate: boolean): void {

    // Emit event
    this.submitModal.emit({
      isValid: true,
      data: {
        ...this.generation,
        step: this.generation.step + 1,
        isActionActivate,
      },
    });
  }

  /**
   * Changed report generation form
   */
  onChangeForm(event: ChangeFormEventInterface<ReportGenerationModel>): void {

    this.changeForm.emit(event);
  }

  /**
   * Error in report generation form
   */
  onErrorForm(event: ErrorFormEventInterface): void {

    this.errorForm.emit(event);
  }
}
