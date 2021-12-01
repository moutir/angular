import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { StateInterface } from '../../../core-store/state.interface';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { WebsiteApiService } from '../../../api/shared/website/website-api.service';
import { WebsiteModel } from '../../../shared/model/website.model';
import { WebsiteSearchModel } from '../../../shared/model/website-search.model';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { WebsiteConfig } from './website.config';
import { LegacyParserService } from '../../../api/format/legacy/legacy-parser.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';

@Injectable()
export class WebsiteService extends ModelServiceAbstract<WebsiteModel> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: WebsiteConfig,
    private store$: Store<StateInterface>,
    private websiteApiService: WebsiteApiService,
    private legacyParserService: LegacyParserService,
    private runtimeService: RuntimeService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): WebsiteModel {

    return new WebsiteModel();
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: WebsiteSearchModel,
  ): Observable<ModelListInterface<WebsiteModel>> {

    return this.websiteApiService.list(pagination, sort, filters);
  }

  /**
   * @inheritDoc
   */
  load(id: string): Observable<WebsiteModel> {

    return zip(
      this.websiteApiService.load(id),
      this.runtimeService.selectOptions(),
      this.runtimeService.selectAvailableLanguages(),
    ).pipe(
      map(([model, options, availableLanguages]) => {

        const website = model.clone<WebsiteModel>();
        const layoutOption = options.websiteLayout.find(opt => opt.value === model.layoutId);
        const templateOption = options.websiteTemplate.find(opt => opt.value === model.templateId);
        const availableLanguageLabels = model.availableLanguageIds.map(langId => availableLanguages[langId]);

        website.layoutLabel = layoutOption ? layoutOption.text : '';
        website.templateLabel = templateOption ? templateOption.text : '';
        website.availableLanguageLabels = availableLanguageLabels;
        website.defaultLanguageLabel = model.defaultLanguageId ? availableLanguages[model.defaultLanguageId] : '';

        return website;
      }),
    );
  }

  /**
   * @inheritDoc
   */
  save(model: WebsiteModel): Observable<ModelSaveInterface> {

    return this
      .websiteApiService
      .save(model)
      .pipe(
        map(response => this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING)),
        catchError(response => of(
          this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING),
        )),
      );
  }
}
