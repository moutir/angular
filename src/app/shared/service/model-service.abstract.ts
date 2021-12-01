import { Observable, of } from 'rxjs';

import { ModelAbstract } from '../class/model.abstract';
import { ModelSaveInterface } from '../interface/model-save.interface';
import { PaginationInterface } from '../interface/pagination.interface';
import { SortInterface } from '../interface/sort.interface';
import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelListInterface } from '../interface/model-list.interface';

export abstract class ModelServiceAbstract<Model extends ModelAbstract> {

  /**
   * Return a model instance with default values
   */
  abstract factory(): Model;

  /**
   * Clone model
   */
  clone(model: Model): Model {

    return Object.assign(this.factory(), model);
  }

  /**
   * Select a model by ID
   */
  select(id: string): Observable<Model|null> {

    return of(null);
  }

  /**
   * Return an observable of a model list
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: ListFiltersInterface,
  ): Observable<ModelListInterface<Model>> {

    return of({
      models: [],
      total: 0,
    });
  }

  /**
   * Return an observable of results count matching the filters
   */
  count(filters: ListFiltersInterface): Observable<number> {

    return of(0);
  }

  /**
   * Return an observable of model IDs matching the filters
   */
  ids(filters: ListFiltersInterface): Observable<string[]> {

    return of([]);
  }

  /**
   * Load model based on ID
   */
  load(id: string): Observable<Model> {

    return of(this.factory());
  }

  /**
   * Save model and return an observable of validation errors
   */
  save(model: Model): Observable<ModelSaveInterface> {

    return of({
      id: model.id,
      modelError: {},
      generalError: [],
    });
  }

  /**
   * Remove record
   */
  remove(id: string): void {

    return;
  }
}
