import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { ContractUpsert } from '../../data-contract/actions/contract-upsert';
import { ContractModel } from '../../../shared/model/contract.model';
import { ContractSearchlistService } from '../../../core/shared/contract/contract-searchlist.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ContractSearchModel } from '../../../shared/model/contract-search.model';
import { ContractSearchOptionsInterface } from '../../../shared/interface/contract-search-options.interface';
import { ContractService } from '../../../core/shared/contract/contract.service';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  ContractModel,
  ContractSearchModel,
  ContractSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: ContractService,
    protected searchlistService: ContractSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  getUpsertAction(models: ContractModel[]): ContractUpsert {

    return new ContractUpsert({
      models: models,
    });
  }
}
