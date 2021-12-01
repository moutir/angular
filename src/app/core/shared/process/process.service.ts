import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { ProcessConfig } from './process.config';
import { ProcessModel } from '../../../shared/model/process.model';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { ProcessSearchModel } from '../../../shared/model/process-search.model';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { ProcessApiService } from '../../../api/shared/process/process-api.service';
import { selectDataProcess } from '../../../core-store/data-process/selectors';

@Injectable()
export class ProcessService extends ModelServiceAbstract<ProcessModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private moduleConfig: ProcessConfig,
    private processApiService: ProcessApiService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): ProcessModel {

    return new ProcessModel();
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<ProcessModel|null> {

    return this.store$.select(selectDataProcess(id));
  }

  /**
   * @inheritDoc
   */
  load(id: string): Observable<ProcessModel> {

    return this
      .processApiService
      .load(id);
  }

  /**
   * @inheritDoc
   */
  save(model: ProcessModel): Observable<ModelSaveInterface> {

    // Nothing to save!
    return of({
      modelError: {},
      generalError: [],
    });
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: ProcessSearchModel,
  ): Observable<ModelListInterface<ProcessModel>> {

    return this.processApiService.list(pagination, sort, filters);
  }

  /**
   * @inheritDoc
   */
  remove(id: string): void {

    // Nothing to remove!
    return;
  }
}
