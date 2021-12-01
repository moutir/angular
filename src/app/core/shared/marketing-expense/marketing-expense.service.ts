import { Injectable } from '@angular/core';
import { Observable, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { MarketingExpenseApiService } from '../../../api/shared/marketing-expense/marketing-expense-api.service';
import { MarketingExpenseModel } from '../../../shared/model/marketing-expense.model';
import { MarketingExpenseSearchModel } from '../../../shared/model/marketing-expense-search.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { LegacyParserService } from '../../../api/format/legacy/legacy-parser.service';
import { MarketingExpenseConfig } from './marketing-expense.config';

@Injectable()
export class MarketingExpenseService extends ModelServiceAbstract<MarketingExpenseModel> {

  /**
   * Constructor
   */
  constructor(
    private runtimeService: RuntimeService,
    private marketingExpenseApiService: MarketingExpenseApiService,
    private legacyParserService: LegacyParserService,
    private moduleConfig: MarketingExpenseConfig,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): MarketingExpenseModel {

    return new MarketingExpenseModel();
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: MarketingExpenseSearchModel,
  ): Observable<ModelListInterface<MarketingExpenseModel>> {

    return this.marketingExpenseApiService.list(pagination, sort, filters);
  }

  /**
   * @inheritDoc
   */
  ids(filters: MarketingExpenseSearchModel): Observable<string[]> {

    return of([]);
  }

  /**
   * @inheritDoc
   */
  load(id: string): Observable<MarketingExpenseModel> {

    return zip(
      this.marketingExpenseApiService.load(id),
      this.runtimeService.selectOptions(),
    ).pipe(
      map(([model, options]) => {

        const expenseModel = model.clone<MarketingExpenseModel>();
        const categoryOption = options.leadSource.find(opt => opt.value === model.mainCategoryId);

        expenseModel.mainCategoryLabel = categoryOption ? categoryOption.text : '';

        return expenseModel;
      }),
    );
  }

  /**
   * @inheritDoc
   */
  save(model: MarketingExpenseModel): Observable<ModelSaveInterface> {

    return this
      .marketingExpenseApiService
      .save(model)
      .pipe(
        map(response => this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING)),
        catchError(response => of(
          this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING),
        )),
      );
  }
}
