import { Injectable } from '@angular/core';
import { Observable, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { WebsiteArticleApiService } from '../../../api/shared/website-article/website-article-api.service';
import { WebsiteArticleModel } from '../../../shared/model/website-article.model';
import { WebsiteArticleSearchModel } from '../../../shared/model/website-article-search.model';
import { WebsiteArticleConfig } from './website-article.config';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { WebsiteContentModel } from '../../../shared/model/website-content.model';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { LegacyParserService } from '../../../api/format/legacy/legacy-parser.service';

@Injectable()
export class WebsiteArticleService extends ModelServiceAbstract<WebsiteArticleModel> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: WebsiteArticleConfig,
    private websiteArticleApiService: WebsiteArticleApiService,
    private runtimeService: RuntimeService,
    private legacyParserService: LegacyParserService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): WebsiteArticleModel {

    return new WebsiteArticleModel();
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: WebsiteArticleSearchModel,
  ): Observable<ModelListInterface<WebsiteArticleModel>> {

    return this.websiteArticleApiService.list(pagination, sort, filters);
  }

  /**
   * @inheritDoc
   */
  load(id: string): Observable<WebsiteArticleModel> {

    return zip(
      this.websiteArticleApiService.load(id),
      this.runtimeService.selectOptions(),
      this.runtimeService.selectCurrentLanguageId(),
      this.runtimeService.selectAvailableLanguageIds(),
    ).pipe(
      map(([model, options, currentLangId, availableLanguageIds]) => {

        const articleModel = model.clone<WebsiteArticleModel>();
        const websiteOption = options.publicationWebsite.find(opt => opt.value === model.websiteId);

        articleModel.websiteUrl = websiteOption ? websiteOption.text : '';

        // Article content per language
        availableLanguageIds.forEach(languageId => {

          if (articleModel.content[languageId]) {

            return;
          }

          articleModel.content[languageId] = new WebsiteContentModel();
        });

        articleModel.title = articleModel.content[currentLangId] ? articleModel.content[currentLangId].title : '';

        return articleModel;
      }),
    );
  }

  /**
   * @inheritDoc
   */
  save(model: WebsiteArticleModel): Observable<ModelSaveInterface> {

    return this
      .websiteArticleApiService
      .save(model)
      .pipe(
        map(response => this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING)),
        catchError(response => of(
          this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING),
        )),
      );
  }
}
