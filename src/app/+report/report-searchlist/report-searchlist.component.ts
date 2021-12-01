import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ReportModel } from '../../shared/model/report.model';
import { ReportSearchOptionsInterface } from '../../shared/interface/report-search-options.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { ReportSearchlistService } from '../../core/shared/report/report-searchlist.service';
import { ReportSearchModel } from '../../shared/model/report-search.model';
import { MenuInterface } from '../../shared/interface/menu.interface';
import { MenuItemInterface } from '../../shared/interface/menu-item.interface';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { ReportService } from '../../core/shared/report/report.service';
import { RuntimeFeatureReportInterface } from '../../shared/interface/runtime-feature-report.interface';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { OperationEnum } from '../../shared/enum/operation.enum';
import { ReportTypeEnum } from '../../shared/enum/report-type.enum';
import { ReportConfig } from '../../core/shared/report/report.config';
import { RuntimeAuthenticationInterface } from '../../shared/interface/runtime-authentication.interface';
import { ReportGenerationInterface } from '../../shared/interface/report-generation.interface';
import { ModalChoiceInterface } from '../../shared/interface/modal-choice.interface';
import { ReportGenerationOptionsInterface } from '../../shared/interface/report-generation-options.interface';
import { ChangeFormEventInterface } from '../../shared/interface/change-form-event.interface';
import { ReportGenerationModel } from '../../shared/model/report-generation.model';
import { ReportActionEnum } from '../../shared/enum/report-action.enum';
import { FormService } from '../../core/shared/form.service';
import { ErrorFormEventInterface } from '../../shared/interface/error-form-event.interface';
import { Dictionary } from '../../shared/class/dictionary';

@Component({
  selector: 'app-report-searchlist',
  templateUrl: './report-searchlist.component.html',
  styleUrls: ['./report-searchlist.component.scss'],
})
export class ReportSearchlistComponent extends SearchlistComponentAbstract<
  ReportModel,
  ReportSearchModel,
  ReportSearchOptionsInterface
> implements OnInit {

  /**
   * Report filters
   */
  @Input() reportType: ReportTypeEnum;
  @Input() dateFrom: Date;
  @Input() dateTo: Date;

  /**
   * State observables
   */
  brochureMenuItems$: Observable<MenuInterface>;
  featureReport$: Observable<RuntimeFeatureReportInterface>;
  runtimePermissions$: Observable<PermissionEnum[]>;
  runtimeAuthentication$: Observable<RuntimeAuthenticationInterface>;
  generation$: Observable<ReportGenerationInterface>;
  generationOptions$: Observable<ReportGenerationOptionsInterface>;
  generationReport$: Observable<ReportModel>;
  generationError$: Observable<Dictionary<string|null>>;
  hasGenerationUpdate$: Observable<boolean>;

  /**
   * Form UIDs
   */
  formUids: string[] = ['generation'];

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: ReportConfig,
    protected searchlistService: ReportSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected reportService: ReportService,
    protected formService: FormService,
  ) {

    super(
      moduleConfig,
      searchlistService,
      runtimeService,
      router,
    );
  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    super.ngOnInit();

    // Set forms
    this.formUids.forEach((uid: string) => {

      this.formService.register(
        [this.uid, uid].join('-'),
      );
    });
  }

  /**
   * Track by model ID
   */
  trackById(index: number, model: ReportModel): string {

    return model.id;
  }

  /**
   * Changed input in report generation form
   */
  onChangeFormGeneration(event: ChangeFormEventInterface<ReportGenerationModel>): void {

    this.reportService.changeGenerationInput(event.model, event.input);
  }

  /**
   * Error in generation form
   */
  onErrorFormGeneration(event: ErrorFormEventInterface): void {

    this.formService.error(
      [this.uid, 'generation'].join('-'),
      event.name,
      event.error,
    );
  }

  /**
   * Submitted modal for report generation
   */
  onSubmitModalGeneration(event: ModalChoiceInterface<ReportGenerationInterface>): void {

    // User cancelled
    if (event.isValid === false) {

      this.reportService.closeModalGeneration();

      return;
    }

    this.reportService.generate(event.data);
  }

  /**
   * @inheritDoc
   */
  onClickMenuItemOperation(menuItem: MenuItemInterface): void {

    // Parent
    super.onClickMenuItemOperation(menuItem);

    this
      .modelsSelected$
      .pipe(take(1))
      .subscribe(reports => {

        if (menuItem.id === OperationEnum.reportSendEmail) {

          this.reportService.sendEmail({
            reports: reports,
            type: this.reportType,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
            language: null,
            isMassAction: true,
          });
        }

        // Reset current operation
        this.resetOperation();
      });
  }

  /**
   * Clicked a brochure menu item
   */
  onClickMenuItemBrochure(menuItem: MenuItemInterface): void {

    const brochure: {
      reportId: string,
      reportType: ReportTypeEnum,
      reportDateFrom: Date,
      reportDateTo: Date,
      brochureType: string,
      language: LanguageEnum,
    } = JSON.parse(menuItem.id);

    // No report ID defined
    if (brochure.reportId === '') {

      return;
    }

    // Date conversion
    brochure.reportDateFrom = brochure.reportDateFrom && new Date(brochure.reportDateFrom);
    brochure.reportDateTo = brochure.reportDateTo && new Date(brochure.reportDateTo);

    // Owner report OR report schedule
    if (brochure.brochureType === 'report_landlord' || brochure.brochureType === 'report_schedule') {

      // Open owner report modal
      this.reportService.openModalGeneration(
        brochure.brochureType === 'report_landlord' ? ReportActionEnum.download : ReportActionEnum.schedule,
        brochure.reportId,
        brochure.reportType,
        brochure.reportDateFrom,
        brochure.reportDateTo,
        brochure.brochureType,
        brochure.language,
      );

      return;
    }

    // Open brochure
    this.reportService.brochure(
      brochure.reportId,
      brochure.reportDateFrom,
      brochure.reportDateTo,
      brochure.brochureType,
      brochure.language,
    );
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    // Set state observables
    this.featureReport$ = this.searchlistService.selectFeatureReport();
    this.runtimePermissions$ = this.runtimeService.selectPermissions();
    this.runtimeAuthentication$ = this.runtimeService.selectAuthentication();
    this.brochureMenuItems$ = this.searchlistService.selectBrochureMenuItems(this.uid);
    this.generation$ = this.reportService.selectGeneration();
    this.generationOptions$ = this.reportService.selectGenerationOptions();
    this.generationReport$ = this.reportService.selectGenerationReport();
    this.generationError$ = this.formService.selectModelError([this.uid, 'generation'].join('-'));
    this.hasGenerationUpdate$ = this.reportService.selectHasGenerationUpdate();
  }
}
