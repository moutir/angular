import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { StateInterface } from '../../../core-store/state.interface';
import { LeadEventSendEmail } from '../../../core-store/ui-lead/actions/lead-event-send-email';
import { TrackingActionEnum } from '../../../shared/enum/tracking-action.enum';
import { BrowserService } from '../browser/browser.service';
import { TrackerService } from '../tracker/tracker.service';
import { LeadModel } from '../../../shared/model/lead.model';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { LeadSearchModel } from '../../../shared/model/lead-search.model';
import { LeadApiService } from '../../../api/shared/lead/lead-api.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ContactService } from '../contact/contact.service';
import { selectDataLead } from '../../../core-store/data-lead/selectors';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { LegacyParserService } from '../../../api/format/legacy/legacy-parser.service';
import { LeadConfig } from './lead.config';
import { LeadContactValidationInterface } from '../../../shared/interface/lead-contact-validation.interface';
import { LeadUpdateIsActiveValidation } from '../../../core-store/ui-lead/actions/lead-update-is-active-validation';
import { selectUiIsActiveValidation, selectUiModifyStatus, selectUiModifyStatusOptions } from '../../../core-store/ui-lead/selectors';
import { LeadEventSaveValidation } from '../../../core-store/ui-lead/actions/lead-event-save-validation';
import { ContactModel } from '../../../shared/model/contact.model';
import { LeadModifyStatusInterface } from '../../../shared/interface/lead-modify-status.interface';
import { LeadEventModifyStatus } from '../../../core-store/ui-lead/actions/lead-event-modify-status';
import { LeadModifyStatusOptionsInterface } from '../../../shared/interface/lead-modify-status-options.interface';

@Injectable()
export class LeadService extends ModelServiceAbstract<LeadModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private browserService: BrowserService,
    private trackerService: TrackerService,
    private leadApiService: LeadApiService,
    private runtimeService: RuntimeService,
    private contactService: ContactService,
    private legacyParserService: LegacyParserService,
    private moduleConfig: LeadConfig,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): LeadModel {

    return new LeadModel();
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<LeadModel|null> {

    return this.store$.select(selectDataLead(id));
  }

  /**
   * Select contact validation active state
   */
  selectIsActiveValidation(): Observable<boolean> {

    return this.store$.select(selectUiIsActiveValidation);
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: LeadSearchModel,
  ): Observable<ModelListInterface<LeadModel>> {

    return this.leadApiService.list(pagination, sort, filters);
  }

  /**
   * @inheritDoc
   */
  load(id: string): Observable<LeadModel> {

    return zip(
      this.leadApiService.load(id),
      this.runtimeService.selectOptions(),
      this.contactService.selectBrokerOptions(),
    ).pipe(
      map(([model, options, brokerOptions]) => {

        const lead = model.clone<LeadModel>();
        const typeOption = options.leadType.find(opt => opt.value === model.typeId);
        const brokerOption = model.broker.id && brokerOptions.find(opt => opt.value === model.broker.id);
        const sourceOption = options.leadSource.find(opt => opt.value === model.sourceId);
        const mediaOption = options.media.find(opt => opt.value === model.mediaId);
        const managementMediaOption = options.media.find(opt => opt.value === model.managementMediaId);
        const statusOption = options.leadStatus.find(opt => opt.value === model.statusId);

        lead.typeLabel = typeOption ? typeOption.text : '';
        lead.sourceLabel = sourceOption ? sourceOption.text : '';
        lead.broker.fullName = brokerOption ? brokerOption.text : '';
        lead.mediaLabel = mediaOption ? mediaOption.text : '';
        lead.managementMediaLabel = managementMediaOption ? managementMediaOption.text : '';
        lead.statusLabel = statusOption ? statusOption.text : '';

        return lead;
      }),
    );
  }

  /**
   * Reply to leads by email
   */
  sendEmail(leads: LeadModel[]): void {

    // Stats
    this.trackerService.track(TrackingActionEnum.leadRowEmail);

    this.store$.dispatch(
      new LeadEventSendEmail({ leads }),
    );
  }

  /**
   * Modify leads' status
   */
  modifyStatus(modifyStatus: LeadModifyStatusInterface): void {

    this.store$.dispatch(
      new LeadEventModifyStatus({ modifyStatus }),
    );
  }

  /**
   * Toggle contact validation
   */
  toggleValidation(isActive: boolean): void {

    this.store$.dispatch(
      new LeadUpdateIsActiveValidation({
        isActive: isActive,
      }),
    );
  }

  /**
   * Validate contact
   */
  validate(): void {

    this.store$.dispatch(new LeadEventSaveValidation({}));
  }

  /**
   * Load lead page
   */
  page(id: string): void {

    // TODO[later] Remove tracking from here and move it to lead page component on init

    // Stats
    this.trackerService.trackString(TrackingActionEnum.leadView, id);

    // Call legacy function to show lead details
    this.browserService.getWindow().loadLeadDetails(id);
  }

  /**
   * @inheritDoc
   */
  save(model: LeadModel): Observable<ModelSaveInterface> {

    return this
      .leadApiService
      .save(model)
      .pipe(
        map(response => this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING)),
        catchError(response => of(
          this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING),
        )),
      );
  }

  /**
   * Load contact validation configuration
   */
  loadValidation(id: string): Observable<LeadContactValidationInterface> {

    return this.leadApiService.loadValidation(id);
  }

  /**
   * Save contact validation
   */
  saveValidation(model: LeadModel): Observable<ContactModel> {

    return this.leadApiService.saveValidation(model);
  }

  /**
   * Select lead modify status
   */
  selectModifyStatus(): Observable<LeadModifyStatusInterface> {

    return this.store$.select(selectUiModifyStatus);
  }

  /**
   * Select lead modify status options
   */
  selectModifyStatusOptions(): Observable<LeadModifyStatusOptionsInterface> {

    return this.store$.select(selectUiModifyStatusOptions);
  }
}
