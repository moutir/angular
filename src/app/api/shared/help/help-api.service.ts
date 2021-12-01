import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { HelpWhoamiResponseInterface } from './help-whoami-response.interface';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { WhoAmIModel } from '../../../shared/model/whoami.model';
import { HelpLoadResponseInterface } from './help-load-response.interface';
import { HelpContentModel } from '../../../shared/model/help-content.model';
import { HelpModel } from '../../../shared/model/help.model';

@Injectable()
export class HelpApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
  ) {

  }

  /**
   * Who am I
   */
  whoAmI(): Observable<WhoAmIModel> {

    return this
      .httpService
      .get<{}, HelpWhoamiResponseInterface>(
        ApiEndpointEnum.helpWhoAmI,
        null,
        null,
        true,
      ).pipe(
        map(response => {

          const whoAmI = new WhoAmIModel();

          whoAmI.data = response.data;
          whoAmI.hash = response.hash;

          return whoAmI;
        }),
      );
  }

  /**
   * Load
  */
  load(): Observable<HelpModel> {

    return this
      .httpService
      .get<null, HelpLoadResponseInterface>(ApiEndpointEnum.helpLoad)
      .pipe(map(response => {

        const helpContents = {};
        const helpModel = new HelpModel();
        helpModel.id = 'help';

        // Contents
        Object.keys(response.categories || {}).forEach(categoryId => {

          const contents = response.data
            .filter(content => content.help_category_id === categoryId)
            .sort((c1, c2) => Number(c1.order) - Number(c2.order))
          ;

          helpContents[categoryId] = contents.map(content => {

            const model = new HelpContentModel();
            model.id = content.id;
            model.categoryId = content.help_category_id;
            model.categoryLabel = content.category;
            model.dependencyId = content.dependency;
            model.formatId = content.help_format_id;
            model.formatLabel = content.content_format;
            model.keyword = content.keyword;
            model.title = content.title;
            model.url = content.url;
            model.order = content.order;
            model.htmlContent = content.content || '';

            return model;
          });
        });

        helpModel.contents = helpContents;

        return helpModel;
      }),
    );
  }
}
