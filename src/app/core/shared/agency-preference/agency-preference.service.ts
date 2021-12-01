import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { StateInterface } from '../../../core-store/state.interface';
import { AgencyPreferenceModel } from '../../../shared/model/agency-preference.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { AgencyPreferenceApiService } from '../../../api/shared/agency-preference/agency-preference-api.service';
import { selectDataAgencyPreference } from '../../../core-store/data-agency-preference/selectors';
import { LegacyParserService } from '../../../api/format/legacy/legacy-parser.service';
import { AgencyPreferenceConfig } from './agency-preference.config';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';

@Injectable()
export class AgencyPreferenceService extends ModelServiceAbstract<AgencyPreferenceModel> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected agencyPreferenceApiService: AgencyPreferenceApiService,
    private moduleConfig: AgencyPreferenceConfig,
    private legacyParserService: LegacyParserService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): AgencyPreferenceModel {

    return new AgencyPreferenceModel();
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<AgencyPreferenceModel|null> {

    return this.store$.select(selectDataAgencyPreference(id));
  }

  /**
   * @inheritDoc
   */
  load(id: string): Observable<AgencyPreferenceModel> {

    return this
      .agencyPreferenceApiService
      .load(id)
      .pipe(
        map(response => {

          const model = new AgencyPreferenceModel();
          model.id = id;

          Object
            .keys(response || [])
            .forEach(key => {

              // Converts snake case to camelCase
              const attr = key.replace(/_[^_]/g, (txt) => txt[1].toUpperCase());

              // Set preference value
              model[attr] = response[key];
            });

          return model;
        }),
      );
  }

  /**
   * @inheritDoc
   */
  save(model: AgencyPreferenceModel): Observable<ModelSaveInterface> {

    return this
      .agencyPreferenceApiService
      .save(model)
      .pipe(
        map(response => {

          // Reset runtime data - agency preference
          this.runtimeService.resetData([RuntimeDataEnum.agencyPreference]);

          return this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING);
        }),
        catchError(response => of(
          this.legacyParserService.parseErrors(
            response,
            this.moduleConfig.SAVE_VALIDATION_MAPPING,
          ),
        )),
      );
  }
}
