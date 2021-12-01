import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError, map } from 'rxjs/operators';

import { SectorConfig } from './sector.config';
import { SectorModel } from '../../../shared/model/sector.model';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { SectorApiService } from '../../../api/shared/sector/sector-api.service';
import { StateInterface } from '../../../core-store/state.interface';
import { selectDataSector } from '../../../core-store/data-sector/selectors';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { SectorSearchModel } from '../../../shared/model/sector-search.model';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { SectorEventRemove } from '../../../core-store/ui-sector/actions/sector-event-remove';
import { JsonapiParserService } from '../../../api/format/jsonapi/jsonapi-parser.service';
import { JsonapiSectorInterface } from '../../../api/format/jsonapi/data/jsonapi-sector.interface';

@Injectable()
export class SectorService extends ModelServiceAbstract<SectorModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private jsonapiParserService: JsonapiParserService,
    private moduleConfig: SectorConfig,
    private sectorApiService: SectorApiService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): SectorModel {

    return new SectorModel();
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<SectorModel|null> {

    return this.store$.select(selectDataSector(id));
  }

  /**
   * @inheritDoc
   */
  load(id: string): Observable<SectorModel> {

    return this.sectorApiService.load(id)
      .pipe(
        map(response => this.jsonapiParserService.parseGetOne<JsonapiSectorInterface, SectorModel>(response)),
      );
  }

  /**
   * @inheritDoc
   */
  save(model: SectorModel): Observable<ModelSaveInterface> {

    return this
      .sectorApiService
      .save(model)
      .pipe(
        map(response => this.jsonapiParserService.parseSave<SectorModel>(response, this.moduleConfig.SAVE_VALIDATION_MAPPING)),
        catchError(response => of(
          this.jsonapiParserService.parseSave<SectorModel>(response, this.moduleConfig.SAVE_VALIDATION_MAPPING),
        )),
      );
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    search: SectorSearchModel,
  ): Observable<ModelListInterface<SectorModel>> {

    return this
      .sectorApiService
      .list(pagination, sort, search)
      .pipe(
        map(response => this.jsonapiParserService.parseGetMany<JsonapiSectorInterface, SectorModel>(response)),
      );
  }

  /**
   * @inheritDoc
   */
  remove(id: string): void {

    this.store$.dispatch(
      new SectorEventRemove({ id: id }),
    );
  }
}
