import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HelpApiService } from '../../../api/shared/help/help-api.service';
import { WhoAmIModel } from '../../../shared/model/whoami.model';
import { HelpModel } from '../../../shared/model/help.model';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';

@Injectable()
export class HelpService extends ModelServiceAbstract<HelpModel> {

  /**
   * Constructor
   */
  constructor(
    private helpApiService: HelpApiService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): HelpModel {

    return new HelpModel();
  }

  /**
   * Who am I
   */
  whoAmI(): Observable<WhoAmIModel> {

    return this
      .helpApiService
      .whoAmI();
  }

  /**
   * Load online help
   */
  load(): Observable<HelpModel> {

    return this.helpApiService.load();
  }
}
