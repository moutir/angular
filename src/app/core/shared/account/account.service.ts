import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AccountModel } from '../../../shared/model/account.model';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { AccountApiJsonapiService } from '../../../api/shared/account/account-api-jsonapi.service';
import { StateInterface } from '../../../core-store/state.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { AccountSearchModel } from '../../../shared/model/account-search.model';
import { JsonapiParserService } from '../../../api/format/jsonapi/jsonapi-parser.service';
import { JsonapiAccountInterface } from '../../../api/format/jsonapi/data/jsonapi-account.interface';
import { selectDataAccount } from '../../../core-store/data-account/selectors';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { LegacyParserService } from '../../../api/format/legacy/legacy-parser.service';
import { AccountApiService } from '../../../api/shared/account/account-api.service';
import { AccountConfig } from './account.config';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ContactTypeEnum } from '../../../shared/enum/contact-type.enum';

@Injectable()
export class AccountService extends ModelServiceAbstract<AccountModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private moduleConfig: AccountConfig,
    private legacyParserService: LegacyParserService,
    private accountApiService: AccountApiService,
    private jsonapiParserService: JsonapiParserService,
    private accountApiJsonapiService: AccountApiJsonapiService,
    private runtimeService: RuntimeService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): AccountModel {

    return new AccountModel();
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<AccountModel|null> {

    return this.store$.select(selectDataAccount(id));
  }

  /**
   * @inheritDoc
   */
  load(id: string): Observable<AccountModel> {

    return this
      .accountApiService
      .load(id);
  }

  /**
   * @inheritDoc
   */
  save(model: AccountModel): Observable<ModelSaveInterface> {

    return combineLatest([
      this.runtimeService.selectFeatureAccount(),
      this.runtimeService.selectAuthentication(),
    ])
    .pipe(
      switchMap(([featureAccount, authentication]) => {

        const saveModel = model.clone<AccountModel>();

        // Adding account or just no manager
        if (!saveModel.id || !saveModel.contact.mainContactId) {

          // Set contact manager
          saveModel.contact.mainContactId = authentication.contactId;
        }

        // Account type to contact types
        if (!!featureAccount.accountTypeMapping[saveModel.accountType['value']]) {

          featureAccount.accountTypeMapping[saveModel.accountType['value']].contactTypeId.forEach(contactTypeId => {

            if (saveModel.contact.contactTypeIds.indexOf(<ContactTypeEnum>String(contactTypeId)) === -1) {

              saveModel.contact.contactTypeIds.push(<ContactTypeEnum>String(contactTypeId));
            }
          });
        }

        return this
          .accountApiService
          .save(saveModel)
          .pipe(
            map(response => this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING)),
            catchError(response => of(
              this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING),
            )),
          );
      }),
    );
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: AccountSearchModel,
  ): Observable<ModelListInterface<AccountModel>> {

    return this.accountApiService.list(pagination, sort, filters);
  }

  /**
   * Return an observable of a model list loaded from the JSON API
   * (13.01.2021 not as complete as legacy API, no BE resource available, takes forever to produce anything on SF API...)
   */
  listJsonapi(
    pagination: PaginationInterface,
    sort: SortInterface,
    search: AccountSearchModel,
  ): Observable<ModelListInterface<AccountModel>> {

    return this
      .accountApiJsonapiService
      .list(pagination, sort, search)
      .pipe(
        map(response => this.jsonapiParserService.parseGetMany<JsonapiAccountInterface, AccountModel>(response)),
      );
  }
}
