import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material';

import { LeadModel } from '../../shared/model/lead.model';
import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { LeadPageService } from '../../core/shared/lead/lead-page.service';
import { LeadOptionsInterface } from '../../shared/interface/lead-options.interface';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { TrackerService } from '../../core/shared/tracker/tracker.service';
import { TrackingActionEnum } from '../../shared/enum/tracking-action.enum';
import { Dictionary } from '../../shared/class/dictionary';
import { LeadModelValidationAdapterStrategy } from '../../core/shared/lead/lead-model-validation-adapter.strategy';
import { LeadService } from '../../core/shared/lead/lead.service';
import { LeadModelGeneralAdapterStrategy } from '../../core/shared/lead/lead-model-general-adapter.strategy';

@Component({
  selector: 'app-lead-page-write',
  templateUrl: './lead-page-write.component.html',
  styleUrls: ['./lead-page-write.component.scss'],
})
export class LeadPageWriteComponent extends PageWriteComponentAbstract<
  LeadModel,
  LeadOptionsInterface
> implements OnInit {

  /**
   * Constants
   */
  readonly PAGE_TAB_GENERAL: PageTabEnum = PageTabEnum.leadWriteGeneral;
  readonly PAGE_TAB_CONTACT_VALIDATION: PageTabEnum = PageTabEnum.leadWriteContactValidation;

  /**
   * State observables
   */
  isActiveValidation$: Observable<boolean>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: LeadPageService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    private trackerService: TrackerService,
    private leadService: LeadService,
    private generalModelAdapterStrategy: LeadModelGeneralAdapterStrategy,
    private validationModelAdapterStrategy: LeadModelValidationAdapterStrategy,
  ) {

    super(
      pageService,
      formService,
      activatedRoute,
    );
  }

  /**
   * @inheritDoc
   */
  ngOnInit(): void {

    super.ngOnInit();

    this.pageService
      .selectModel()
      .pipe(take(1))
      .subscribe(model => {

        if (model.id) {

          // Stats
          this.trackerService.trackString(TrackingActionEnum.leadView, model.id);
        }
      });
  }

  /**
   * @inheritDoc
   */
  onChangeTab(event: MatTabChangeEvent): void {

    super.onChangeTab(event);

    // Tab UID set manually in the mat-tab (Example: <mat-tab id="contact-read-profile">)
    const dataTabUid = event.tab.content.origin.nativeElement.parentElement.id;

    // Contact validation
    if (dataTabUid === PageTabEnum.leadWriteContactValidation) {

      this.leadService.toggleValidation(true);
    }
  }

  /**
   * @inheritDoc
   */
  protected getFieldTabMapping(): Dictionary<PageTabEnum> {

    const fieldTabMapping: Dictionary<PageTabEnum> = {};
    const model = new LeadModel();

    // Set up general tab fields
    Object
      .keys(this.generalModelAdapterStrategy.getFormControlConfig(model))
      .forEach((controlName) => fieldTabMapping[controlName] = PageTabEnum.leadWriteGeneral);

    // Set up contact validation tab fields
    Object
      .keys(this.validationModelAdapterStrategy.getFormControlConfig(model))
      .forEach((controlName) => fieldTabMapping[controlName] = PageTabEnum.leadWriteContactValidation);

    return fieldTabMapping;
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.isActiveValidation$ = this.leadService.selectIsActiveValidation();
  }
}
