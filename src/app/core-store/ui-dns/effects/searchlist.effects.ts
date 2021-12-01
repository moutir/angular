import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { DnsUpsert } from '../../data-dns/actions/dns.upsert';
import { DnsModel } from '../../../shared/model/dns.model';
import { DnsService } from '../../../core/shared/dns/dns.service';
import { DnsSearchlistService } from '../../../core/shared/dns/dns-searchlist.service';
import { DnsSearchModel } from '../../../shared/model/dns-search.model';
import { DnsSearchOptionsInterface } from '../../../shared/interface/dns-search-options.interface';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  DnsModel,
  DnsSearchModel,
  DnsSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: DnsService,
    protected searchlistService: DnsSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(models: ModelAbstract[]): DnsUpsert {

    return new DnsUpsert({
      models: <DnsModel[]>models,
    });
  }
}
