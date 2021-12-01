import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { RuntimeDataProvider } from '../runtime-data-provider';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { RuntimeConfig } from '../../runtime.config';
import { RuntimeDataResponseInterface } from '../../../api/shared/runtime/runtime-data-response.interface';

@Injectable()
export class ConfigDataProviderStrategy extends RuntimeDataProvider {

  /**
   * Constructor
   */
  constructor(
    private runtimeConfig: RuntimeConfig,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  protected load(keys: RuntimeDataEnum[]): Observable<RuntimeDataResponseInterface> {

    return of(this.runtimeConfig.data);
  }
}
