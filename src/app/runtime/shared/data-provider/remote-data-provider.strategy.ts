import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RuntimeDataProvider } from '../runtime-data-provider';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { RuntimeApiService } from '../../../api/shared/runtime/runtime-api.service';
import { RuntimeDataResponseInterface } from '../../../api/shared/runtime/runtime-data-response.interface';

@Injectable()
export class RemoteDataProviderStrategy extends RuntimeDataProvider {

  /**
   * Constructor
   */
  constructor(
    private runtimeApiService: RuntimeApiService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  protected load(keys: RuntimeDataEnum[]): Observable<RuntimeDataResponseInterface> {

    return this.runtimeApiService.data(keys);
  }
}
