import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, zip } from 'rxjs';
import { Store } from '@ngrx/store';

import { StateInterface } from '../../../core-store/state.interface';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { MlsApiService } from '../../../api/shared/mls/mls-api.service';
import { MlsModel } from '../../../shared/model/mls.model';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { MlsSearchModel } from '../../../shared/model/mls-search.model';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { MlsStatusEnum } from '../../../shared/enum/mls-status.enum';
import { RuntimeAuthenticationInterface } from '../../../shared/interface/runtime-authentication.interface';
import { AgencyModel } from '../../../shared/model/agency.model';
import { selectDataMlsAgencies } from '../../../core-store/data-mls/selectors';
import { selectUiIsLoadingAgency, selectUiSearchQuery, selectUiSelectedAgency } from '../../../core-store/ui-mls/selectors';
import { MlsEventAddAgency } from '../../../core-store/ui-mls/actions/mls-event-add-agency';
import { MlsEventSearch } from '../../../core-store/ui-mls/actions/mls-event-search';

@Injectable()
export class MlsService extends ModelServiceAbstract<MlsModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private mlsApiService: MlsApiService,
    private runtimeService: RuntimeService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): MlsModel {

    return new MlsModel();
  }

  /**
   * Select mls agencies
   */
  selectAgencies(): Observable<AgencyModel[]> {

    return this.store$.select(selectDataMlsAgencies);
  }

  /**
   * Select search query
   */
  selectSearchQuery(): Observable<string> {

    return this.store$.select(selectUiSearchQuery);
  }

  /**
   * Select the selected agency
   */
  selectSelectedAgency(): Observable<AgencyModel> {

    return this.store$.select(selectUiSelectedAgency);
  }

  /**
   * Select agency loading state
   */
  selectIsLoadingAgency(): Observable<boolean> {

    return this.store$.select(selectUiIsLoadingAgency);
  }

  /**
   * Search for agencies matching the query
   */
  searchAgencies(query: string): void {

    // Prevent search queries shorter than 2 characters
    if (query.length > 0 && query.length <= 2) {

      return;
    }

    this.store$.dispatch(
      new MlsEventSearch({ query }),
    );
  }

  /**
   * Add agency
   */
  addAgency(agency: AgencyModel): void {

    this.store$.dispatch(
      new MlsEventAddAgency({ agency }),
    );
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: MlsSearchModel,
  ): Observable<ModelListInterface<MlsModel>> {

    return zip(
      this.mlsApiService.list(pagination, sort, filters),
      this.runtimeService.selectOptions(),
      this.runtimeService.selectAuthentication(),
    ).pipe(
      map(([list, options, authentication]) => {

        list.models = list.models.map(model => this.fixBackendLogic(model, authentication));

        return list;
      }),
    );
  }

  /**
   * @inheritDoc
   */
  load(id: string): Observable<MlsModel> {

    return zip(
      this.mlsApiService.load(id),
      this.runtimeService.selectAuthentication(),
    ).pipe(
      map(([model, authentication]) => this.fixBackendLogic(model, authentication)),
    );
  }

  /**
   * Fix backend logic that depending on MLS status, has 2 records or 1 record per partnership, with a shared status ID for received/sent
   * TODO[later] Remove this horrible logic once API on SF
   */
  private fixBackendLogic(model: MlsModel, authentication: RuntimeAuthenticationInterface): MlsModel {

    // Partner is not user's agency
    if (model.partnerAgency.id !== authentication.agencyId) {

      return model;
    }

    const newModel = model.clone<MlsModel>();

    // Reverser agency and partner
    const partnerAgency = newModel.partnerAgency;
    newModel.partnerAgency = newModel.agency;
    newModel.agency = partnerAgency;

    // Update 'pending' status to 'received' status
    if (MlsStatusEnum.pending === model.statusId) {

      newModel.statusId = MlsStatusEnum.received;
    }

    return newModel;
  }
}
