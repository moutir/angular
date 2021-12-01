import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StateInterface } from '../../../core-store/state.interface';
import { AgencyModel } from '../../../shared/model/agency.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { AgencyApiService } from '../../../api/shared/agency/agency-api.service';
import { selectDataAgency } from '../../../core-store/data-agency/selectors';
import { RuntimeApiService } from '../../../api/shared/runtime/runtime-api.service';

@Injectable()
export class AgencyService extends ModelServiceAbstract<AgencyModel> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected agencyApiService: AgencyApiService,
    protected runtimeApiService: RuntimeApiService,
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
   * @inheritDoc
   */
  load(): Observable<AgencyModel> {

    return this
      .agencyApiService
      .load()
      .pipe(
        map(response => {

          const model = new AgencyModel();
          model.id = 'agency';
          model.contractOptions = response.data.map(option => {

            return {
              id: option.id,
              label: option.label,
              isActive: option.active,
            };
          });

          return model;
        }),
      );
  }
}
