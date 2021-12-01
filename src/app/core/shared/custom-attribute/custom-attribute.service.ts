import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { CustomAttributeModel } from '../../../shared/model/custom-attribute.model';
import { StateInterface } from '../../../core-store/state.interface';
import { CustomAttributeApiService } from '../../../api/shared/custom-attribute/custom-attribute-api.service';
import { CustomAttributeConfig } from './custom-attribute.config';
import { selectDataCustomAttribute } from '../../../core-store/data-custom-attribute/selectors';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { CustomAttributeSearchModel } from '../../../shared/model/custom-attribute-search.model';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { CustomAttributeEventRemove } from '../../../core-store/ui-custom-attribute/actions/custom-attribute-event-remove';
import { CustomAttributeValueApiService } from '../../../api/shared/custom-attribute-value/custom-attribute-value-api.service';
import { CustomAttributeValueModel } from '../../../shared/model/custom-attribute-value.model';
import { JsonapiParserService } from '../../../api/format/jsonapi/jsonapi-parser.service';
import { JsonapiCustomAttributeInterface } from '../../../api/format/jsonapi/data/jsonapi-custom-attribute.interface';

@Injectable()
export class CustomAttributeService extends ModelServiceAbstract<CustomAttributeModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private jsonapiParserService: JsonapiParserService,
    private moduleConfig: CustomAttributeConfig,
    private customAttributeApiService: CustomAttributeApiService,
    private customAttributeValueApiService: CustomAttributeValueApiService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): CustomAttributeModel {

    return new CustomAttributeModel();
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<CustomAttributeModel|null> {

    return this.store$.select(selectDataCustomAttribute(id));
  }

  /**
   * @inheritDoc
   */
  load(id: string): Observable<CustomAttributeModel> {

    return this
      .customAttributeApiService
      .load(id)
      .pipe(
        map(response => this.jsonapiParserService.parseGetOne<JsonapiCustomAttributeInterface, CustomAttributeModel>(response)),
      );
  }

  /**
   * @inheritDoc
   */
  save(model: CustomAttributeModel): Observable<ModelSaveInterface> {

    return this
      .customAttributeApiService
      .save(model)
      .pipe(
        map(response => { throw response; }),
        catchError(response => {

          const modelSave = this.jsonapiParserService.parseSave<CustomAttributeModel>(response, this.moduleConfig.SAVE_VALIDATION_MAPPING);
          const subcalls = [];

          // Contract save failed
          if (!response || !response.data || !response.data.id) {

            return of(modelSave);
          }

          model.values.map((value, i) => {

            // Delete
            if (value.isRemoved === true) {

              // Has an ID
              if (value.id) {

                subcalls.push(
                  this.customAttributeValueApiService.remove(value.id),
                );
              }

              return;
            }

            // Update
            const customAttributeValue = new CustomAttributeValueModel();

            Object.keys(value).forEach(key => customAttributeValue[key] = value[key]);
            customAttributeValue.customAttributeId = model.id || response.data && response.data.id;

            subcalls.push(
              this
                .customAttributeValueApiService
                .save(customAttributeValue)
                .pipe(
                  map(res => { throw res; }),
                  catchError(res => {

                    const valueModelSave = this
                        .jsonapiParserService
                        .parseSave<CustomAttributeValueModel>(res, this.moduleConfig.SAVE_VALIDATION_MAPPING, i);

                    // Model error
                    if (Object.keys(valueModelSave.modelError).length > 0) {

                      modelSave.modelError = {
                        ...modelSave.modelError,
                        ...valueModelSave.modelError,
                      };
                    }

                    // General error
                    valueModelSave.generalError.forEach(generalError => modelSave.generalError.push(generalError));

                    return of(modelSave);
                  }),
                ),
            );
          });

          return subcalls.length > 0 ? forkJoin(subcalls).pipe(map(whatever => modelSave)) : of(modelSave);
        }),
      );
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    search: CustomAttributeSearchModel,
  ): Observable<ModelListInterface<CustomAttributeModel>> {

    return this
      .customAttributeApiService
      .list(pagination, sort, search)
      .pipe(
        map(response => this.jsonapiParserService.parseGetMany<JsonapiCustomAttributeInterface, CustomAttributeModel>(response)),
      );
  }

  /**
   * @inheritDoc
   */
  remove(id: string): void {

    this.store$.dispatch(
      new CustomAttributeEventRemove({ id: id }),
    );
  }
}
