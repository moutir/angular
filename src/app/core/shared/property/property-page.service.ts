import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { PropertyConfig } from './property.config';
import { PropertyModel } from '../../../shared/model/property.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { PropertyService } from './property.service';

@Injectable()
export class PropertyPageService extends PageServiceAbstract<PropertyModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: PropertyConfig,
    protected modelService: PropertyService,
  ) {

    super(
      store$,
      runtimeService,
      router,
      moduleConfig,
      modelService,
    );
  }
}
