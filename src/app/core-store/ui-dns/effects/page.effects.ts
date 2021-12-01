import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { FormService } from '../../../core/shared/form.service';
import { DnsModel } from '../../../shared/model/dns.model';
import { DnsUpsert } from '../../data-dns/actions/dns.upsert';
import { DnsService } from '../../../core/shared/dns/dns.service';
import { DnsPageService } from '../../../core/shared/dns/dns-page.service';

@Injectable()
export class PageEffects extends EffectsAbstract<DnsModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: DnsPageService,
    protected modelService: DnsService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: DnsModel): Action {

    return new DnsUpsert({
      models: [model],
    });
  }
}
