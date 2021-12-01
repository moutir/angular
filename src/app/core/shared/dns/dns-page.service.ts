import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { DnsConfig } from './dns.config';
import { DnsService } from './dns.service';
import { DnsModel } from '../../../shared/model/dns.model';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';

@Injectable()
export class DnsPageService extends PageServiceAbstract<DnsModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: DnsConfig,
    protected modelService: DnsService,
  ) {

    super(
      store$,
      runtimeService,
      router,
      moduleConfig,
      modelService,
    );
  }

  /**
   * @inheritDoc
   */
  redirect(type: PageTypeEnum|null, id: string|null): void {

    // Home
    if (type === null) {

      this.router.navigate(['/agency']);
      return;
    }

    return super.redirect(type, id);
  }
}
