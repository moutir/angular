import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { StateInterface } from '../../../core-store/state.interface';
import { AgencyModel } from '../../../shared/model/agency.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { selectDataAgency } from '../../../core-store/data-agency/selectors';
import { RuntimeApiService } from '../../../api/shared/runtime/runtime-api.service';
import { AgencyProfileApiService } from '../../../api/shared/agency-profile/agency-profile-api.service';
import { DocumentModel } from '../../../shared/model/document.model';
import { AgencyProfileEventSetImage } from '../../../core-store/ui-agency-profile/actions/agency-profile-event-set-image';
import { AgencyEmailPreviewInterface } from '../../../shared/interface/agency-email-preview.interface';
import { selectUiEmailPreview } from '../../../core-store/ui-agency-profile/selectors';
import { AgencyProfileUpdateEmailPreview } from '../../../core-store/ui-agency-profile/actions/agency-profile-update-email-preview';
import { AgencyEmailPreviewDataInterface } from '../../../shared/interface/agency-email-preview-data.interface';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { LegacyParserService } from '../../../api/format/legacy/legacy-parser.service';
import { AgencyProfileConfig } from './agency-profile.config';
import { AgencyProfileEventEmailPreview } from '../../../core-store/ui-agency-profile/actions/agency-profile-event-email-preview';
import { ContactAddressModel } from '../../../shared/model/contact-address.model';

@Injectable()
export class AgencyProfileService extends ModelServiceAbstract<AgencyModel> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected agencyProfileApiService: AgencyProfileApiService,
    protected runtimeApiService: RuntimeApiService,
    private legacyParserService: LegacyParserService,
    private moduleConfig: AgencyProfileConfig,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): AgencyModel {

    return new AgencyModel();
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<AgencyModel|null> {

    return this.store$.select(selectDataAgency(id));
  }

  /**
   * Select email preview
   */
  selectEmailPreview(): Observable<AgencyEmailPreviewInterface> {

    return this.store$.select(selectUiEmailPreview);
  }

  /**
   * @inheritDoc
   */
  load(): Observable<AgencyModel> {

    return zip(
      this.agencyProfileApiService.load(),
      this.runtimeService.selectOptions(),
    ).pipe(
      map(([model, options]) => {

        const agencyModel = model.clone<AgencyModel>();

        agencyModel.addresses = model.addresses.map(address => {

          const newAddressModel = address.clone<ContactAddressModel>();
          const countryOption = options.countryById.find(opt => opt.value === newAddressModel.countryId);
          newAddressModel.countryLabel = countryOption ? countryOption.text : '';

          return newAddressModel;
        });

        agencyModel.emailTemplateId = '1';

        return agencyModel;
      }),
    );
  }

  /**
   * Set/reset agency logo
   */
  setLogo(imageDocument: DocumentModel, isSet: boolean): void {

    this.store$.dispatch(
      new AgencyProfileEventSetImage({
        uid: isSet ? 'logo-set' : 'logo-remove',
        imageDocument: imageDocument,
      }),
    );
  }

  /**
   * Set/reset agency watermark
   */
  setWatermark(imageDocument: DocumentModel, isSet: boolean): void {

    this.store$.dispatch(
      new AgencyProfileEventSetImage({
        uid: isSet ? 'watermark-set' : 'watermark-remove',
        imageDocument: imageDocument,
      }),
    );
  }

  /**
   * Set/reset default property image for the agency
   */
  setDefaultPropertyImage(imageDocument: DocumentModel, isSet: boolean): void {

    this.store$.dispatch(
      new AgencyProfileEventSetImage({
        uid: isSet ? 'default-property-image-set' : 'default-property-image-remove',
        imageDocument: imageDocument,
      }),
    );
  }

  /**
   * Set/reset prestige brochure cover for the agency
   */
  setPrestigeBrochureCover(imageDocument: DocumentModel, isSet: boolean): void {

    this.store$.dispatch(
      new AgencyProfileEventSetImage({
        uid: isSet ? 'prestige-brochure-cover-set' : 'prestige-brochure-cover-remove',
        imageDocument: imageDocument,
      }),
    );
  }

  /**
   * Set/reset email banner for the agency
   */
  setEmailBanner(imageDocument: DocumentModel, isSet: boolean): void {

    this.store$.dispatch(
      new AgencyProfileEventSetImage({
        uid: isSet ? 'email-banner-set' : 'email-banner-remove',
        imageDocument: imageDocument,
      }),
    );
  }

  /**
   * Email preview
   */
  emailPreview(): void {

    this.store$.dispatch(
      new AgencyProfileEventEmailPreview({}),
    );
  }

  /**
   * Close email preview modal
   */
  closeEmailPreview(): void {

    this.store$.dispatch(new AgencyProfileUpdateEmailPreview({
      emailPreview: {
        isOpen: false,
        data: {
          template: '',
          data: null,
        },
      },
    }));
  }

  /**
   * Load email preview
   */
  loadEmailPreview(model: AgencyModel): Observable<AgencyEmailPreviewDataInterface> {

    return this
      .agencyProfileApiService
      .loadEmailPreview(model)
      .pipe(
        map(template => {

          return {
            template: template,
            data: {
              propertyData: [],
              background_color_head_foot: model.bgColorHeaderFooter,
              background_color_main: model.bgColorMain,
              background_color_message: model.bgColorMessage,
              background_color_property_title: model.bgColorTitle,
              text_color_head_foot: model.textColorHeaderFooter,
              text_color_main: model.textColorMain,
              text_color_message: model.textColorMessage,
              text_color_property_title: model.textColorTitle,
            },
          };
      }),
    );
  }

  /**
   * @inheritDoc
   */
  save(model: AgencyModel): Observable<ModelSaveInterface> {

    return this
      .agencyProfileApiService
      .save(model)
      .pipe(
        map(response => this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING)),
        catchError(response => of(
          this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING),
        )),
      );
  }
}
