import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { HistoryListRequestInterface } from './history-list-request.interface';
import { HistoryListResponseInterface } from './history-list-response.interface';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { HistoryModel } from '../../../shared/model/history.model';
import { HelperService } from '../../../core/shared/helper.service';
import { DateFormatEnum } from '../../../shared/enum/date-format.enum';
import { HistoryEventTypeEnum } from '../../../shared/enum/history-event-type.enum';
import { ContactTypeEnum } from '../../../shared/enum/contact-type.enum';

@Injectable()
export class HistoryApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
    private translateService: TranslateService,
  ) {

  }

  /**
   * List history models
   */
  list(
    entity: string,
    entityId: string,
  ): Observable<ModelListInterface<HistoryModel>> {

    const request = {
      [[entity, 'id'].join('_')]: entityId,
    };

    return this
      .httpService
      .get<HistoryListRequestInterface, HistoryListResponseInterface>(
        ApiEndpointEnum.historyList,
        request,
        { module: entity },
        null,
      )
      .pipe(
        map(response => this.listResponse(response)),
      );
  }

  /**
   * Handle a list() response and return a list of history models
   */
  private listResponse(response: HistoryListResponseInterface): ModelListInterface<HistoryModel> {

    let models  = [];

    Object.values(response.history).forEach(value => models = [ ...models, ...value ]);

    return {
      models: models
        .sort((a, b) => (a.event_datetime < b.event_datetime) ? 1 : -1)
        .map((data, i) => {

          const history = new HistoryModel();

          if (!data.event_label || data.event_label === '<br/>') {

            return history;
          }

          // Generate ID as there is no history ID from response
          history.id = [
            data.event_datetime,
            data.event_type,
            data.event_maker_id,
            (data.event_label || ''),
          ].join('_').replace(/\s/g, '-').toLowerCase();

          // Dates
          history.date = data.event_datetime ? this.helperService.stringToDate(data.event_datetime) : null;
          history.labelDate = history.date ? this.helperService.dateToString(history.date, DateFormatEnum.switzerland) : null;
          history.labelTime = history.date ? history.date.toTimeString().split(' ')[0] : '';

          history.link = data.link || '';
          history.broker.companyLogoUrl = data.agency_logo || '';
          history.comment = data.event_label || '';

          // Link available AND the comment has no links inside
          if (history.link && (history.comment.indexOf('</a>')) === -1) {

            history.comment = '<a href="' + history.link + '" target="_blank">' + history.comment.replace(/\|/g, '') + '</a>';
          } else {

            history.comment = history.comment
              .replace(/\|(.*?)\|/, (p) => history.link ? ('<a href="' + history.link + '" target="_blank">' + p + '</a>') : p)
              .replace(/\|/g, '')
            ;
          }

          // Replace legacy routes with angular routes
          history.comment = history.comment
            .replace('/tasks/index', '/task')
          ;

          if (data.event_maker_full_name) {

            history.broker.id = data.event_maker_id;
            history.broker.fullName = data.event_maker_full_name || '';

            // For type 'Lead', it's lead contact - not broker
            if (data.event_type !== HistoryEventTypeEnum.lead) {

              history.broker.type = ContactTypeEnum.colleague;
            }
          }

          // Previous values
          if (data.event_data_diff) {

            history.labelPreviousValues = this.translateService.instant('label_previous_values') + '\n';

            Object.keys(data.event_data_diff).forEach(k => {

              history.labelPreviousValues += [
                '-',
                (this.translateService.instant(k) + ':'),
                ('"' + (data.event_data_diff[k] || '') + '"'),
                '\n',
              ].join(' ');
            });
          }

          return history;
        },
      ),
      total: models.length,
    };
  }
}
