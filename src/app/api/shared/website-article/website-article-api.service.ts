import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { WebsiteArticleListRequestInterface } from './website-article-list-request.interface';
import { WebsiteArticleListResponseInterface } from './website-article-list-response.interface';
import { WebsiteArticleSearchModel } from '../../../shared/model/website-article-search.model';
import { WebsiteArticleModel } from '../../../shared/model/website-article.model';
import { HelperService } from '../../../core/shared/helper.service';
import { WebsiteArticleLoadResponseInterface } from './website-article-load-response.interface';
import { WebsiteContentModel } from '../../../shared/model/website-content.model';
import { LegacySaveResponseInterface } from '../../format/legacy/response/legacy-save-response.interface';
import { WebsiteArticleSaveRequestInterface } from './website-article-save-request.interface';

@Injectable()
export class WebsiteArticleApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
  ) {

  }

  /**
   * List
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: WebsiteArticleSearchModel,
  ): Observable<ModelListInterface<WebsiteArticleModel>> {

    return this
      .httpService
      .get<WebsiteArticleListRequestInterface, WebsiteArticleListResponseInterface>(
        ApiEndpointEnum.websiteArticleList,
        this.listRequest(pagination, sort, filters),
        null,
        true,
      )
      .pipe(
        map(response => this.listResponse(response)),
      )
    ;
  }

  /**
   * Load
   */
  load(id: string): Observable<WebsiteArticleModel> {

    return this.httpService.get<null, WebsiteArticleLoadResponseInterface>(
      ApiEndpointEnum.websiteArticleLoad,
      null,
      { id },
      true,
    ).pipe(
      map(response => this.loadResponse(response)),
    );
  }

  /**
   * Save article
   */
  save(article: WebsiteArticleModel): Observable<LegacySaveResponseInterface> {

    return this
      .httpService
      .post<WebsiteArticleSaveRequestInterface, LegacySaveResponseInterface>(
        ApiEndpointEnum.websiteArticleSave,
        this.saveRequest(article),
        { id: article.id },
        true,
      );
  }

  /**
   * Handle a list() request parameters and return a formatted request
   */
  private listRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: WebsiteArticleSearchModel,
  ): WebsiteArticleListRequestInterface {

    const request = <WebsiteArticleListRequestInterface> {
      start: (pagination.page - 1) * pagination.perPage,
      length: pagination.perPage,
      sort_id: sort.id,
      sort_order: sort.order,
    };

    return request;
  }

  /**
   * Handle a list() response and return a list of website article models
   */
  private listResponse(response: WebsiteArticleListResponseInterface): ModelListInterface<WebsiteArticleModel> {

    return {
      models: response.data.map((data, i) => {

        const article = new WebsiteArticleModel();

        article.id = data.DT_RowId;
        article.title = data.title;
        article.author = data.author;
        article.websiteUrl = data.main_url;
        article.creationDate = this.helperService.stringToDate(data.creation_datetime);
        article.isPublished = data.is_published;

        return article;
      }),
      total: parseInt(response.recordsTotal, 10),
    };
  }

  /**
   * Handle a load() response and return an website article model
   */
  private loadResponse(data: WebsiteArticleLoadResponseInterface): WebsiteArticleModel {

    const model = new WebsiteArticleModel();

    model.id = data.id;
    model.websiteId = data.agency_website_id;
    model.author = data.author;
    model.creationDate = this.helperService.stringToDate(data.creation_datetime);
    model.isPublished = data.published === '1';

    // Contents
    (data.content || []).forEach(content => {

      const contentModel = new WebsiteContentModel();

      contentModel.title = content.title;
      contentModel.description = content.content;
      contentModel.seoKeyword = content.seo_keywords;
      contentModel.seoDescription = content.seo_description;

      model.content[content.language] = contentModel;
    });

    return model;
  }

  /**
   * Handle save() request parameters and return a formatted request
   */
  private saveRequest(model: WebsiteArticleModel): WebsiteArticleSaveRequestInterface {

    const request: WebsiteArticleSaveRequestInterface = <WebsiteArticleSaveRequestInterface>{
      agency_website_article_agency_website: model.websiteId,
      agency_website_article_published: model.isPublished === true ? '1' : '0',
      agency_website_article_author: model.author,
      agency_website_article_creation: this.helperService.dateToString(model.creationDate),
    };

    const content = {};

    Object.keys(model.content).forEach(lang => {

      content[lang] = {
        title: model.content[lang].title,
        description: model.content[lang].description,
        seo_keyword: model.content[lang].seoKeyword,
        seo_description: model.content[lang].seoDescription,
      };
    });

    request.contents = JSON.stringify(content);

    return request;
  }
}
