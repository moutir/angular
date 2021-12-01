import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

import { SortInterface } from '../../../shared/interface/sort.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { EmailTemplateListRequestInterface } from './email-template-list-request.interface';
import { EmailTemplateListResponseInterface } from './email-template-list-response.interface';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { EmailTemplateModel } from '../../../shared/model/email-template.model';
import { EmailTemplateSearchModel } from '../../../shared/model/email-template-search.model';
import { EmailTemplateLoadResponseInterface } from './email-template-load-response.interface';
import { EmailTemplateRemoveRequestInterface } from './email-template-remove-request.interface';
import { LegacySaveResponseInterface } from '../../format/legacy/response/legacy-save-response.interface';
import { EmailTemplateSaveRequestInterface } from './email-template-save-request.interface';
import { EmailTemplateLoadRequestInterface } from './email-template-load-request.interface';

@Injectable()
export class EmailTemplateApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
  ) {

  }

  /**
   * List mailing templates
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: EmailTemplateSearchModel,
  ): Observable<ModelListInterface<EmailTemplateModel>> {

    return this
      .httpService
      .post<EmailTemplateListRequestInterface, EmailTemplateListResponseInterface>(
        ApiEndpointEnum.emailTemplateList,
        this.listRequest(pagination, sort, filters),
        null,
        true,
      )
      .pipe(
        map(response => this.listResponse(response)),
      );
  }

  /**
   * Load
   */
  load(id: string): Observable<EmailTemplateLoadResponseInterface> {

    return this
      .httpService
      .post<EmailTemplateLoadRequestInterface, EmailTemplateLoadResponseInterface>(
        ApiEndpointEnum.emailTemplateLoad,
        { ready_made_content_id: id },
        null,
        true,
      );
  }

  /**
   * Remove email template by id
   */
  remove(id: string): Observable<HttpResponse<null>> {

    return this
      .httpService
      .post<EmailTemplateRemoveRequestInterface, HttpResponse<null>>(
        ApiEndpointEnum.emailTemplateDelete,
        { ready_made_content_id: id },
        null,
        true,
      );
  }

  /**
   * Save email template
   */
  save(model: EmailTemplateModel): Observable<LegacySaveResponseInterface> {

    return this
      .httpService
      .post<EmailTemplateSaveRequestInterface, LegacySaveResponseInterface>(
        ApiEndpointEnum.emailTemplateSave,
        this.saveRequest(model),
        null,
        true,
      );
  }

  /**
   * Handle a list() request parameters and return a formatted request
   */
  private listRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: EmailTemplateSearchModel,
  ): EmailTemplateListRequestInterface {

    return <EmailTemplateListRequestInterface>{
        start: (pagination.page - 1) * pagination.perPage,
        length: pagination.perPage,
        sort_id: sort.id,
        sort_order: sort.order,
    };
  }

  /**
   * Handle a list() response and return a list of email template models
   */
  private listResponse(response: EmailTemplateListResponseInterface): ModelListInterface<EmailTemplateModel> {

    return {
      models: response.data.map((data, i) => {

        const emailTemplate = new EmailTemplateModel();

        emailTemplate.id = data.id;
        emailTemplate.label = data.label;
        emailTemplate.isShared = data.is_shared;

        // Creator
        if (data.creator) {

          emailTemplate.createContact.id = data.creator.id;
          emailTemplate.createContact.fullName = data.creator.name;
        }

        return emailTemplate;
      }),
      total: parseInt(response.recordsTotal, 10),
    };
  }

  /**
   * Handle a save() request parameters and return a formatted request
   */
  private saveRequest(model: EmailTemplateModel): EmailTemplateSaveRequestInterface {

    const request: EmailTemplateSaveRequestInterface = <EmailTemplateSaveRequestInterface>{
      ready_made_content_id: model.id || '0',
      ready_made_content_shared: model.isShared ? 1 : 0,
    };

    const contents = {};

    Object.keys(model.content).forEach(lang => {

      contents[lang] = {
        title: model.content[lang].title,
        subject: model.content[lang].subject,
        message: model.content[lang].message,
      };
    });

    request.contents = JSON.stringify(contents);

    return request;
  }

}
