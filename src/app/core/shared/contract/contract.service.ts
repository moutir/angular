import { Injectable } from '@angular/core';
import { merge, Observable, of, zip } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError, last, map } from 'rxjs/operators';

import { ContractModel } from '../../../shared/model/contract.model';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { selectDataContract } from '../../../core-store/data-contract/selectors';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { ContractSearchModel } from '../../../shared/model/contract-search.model';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { HelperService } from '../helper.service';
import { ContractConfig } from './contract.config';
import { JsonapiParserService } from '../../../api/format/jsonapi/jsonapi-parser.service';
import { JsonapiContractInterface } from '../../../api/format/jsonapi/data/jsonapi-contract.interface';
import { ContractApiService } from '../../../api/shared/contract/contract-api.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ContractContactApiService } from '../../../api/shared/contract-contact/contract-contact-api.service';
import { ContractCommissionApiService } from '../../../api/shared/contract-commission/contract-commission-api.service';
import { ContractCommissionModel } from '../../../shared/model/contract-commission.model';
import { ContractContactModel } from '../../../shared/model/contract-contact.model';
import { KeyValueType } from '../../../shared/type/key-value.type';

@Injectable()
export class ContractService extends ModelServiceAbstract<ContractModel> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected contractApiService: ContractApiService,
    private jsonapiParserService: JsonapiParserService,
    protected moduleConfig: ContractConfig,
    protected helperService: HelperService,
    private runtimeService: RuntimeService,
    private contractContactApiService: ContractContactApiService,
    private contractCommissionApiService: ContractCommissionApiService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): ContractModel {

    return new ContractModel();
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<ContractModel|null> {

    return this.store$.select(selectDataContract(id));
  }

  /**
   * @inheritDoc
   */
  load(id: string): Observable<ContractModel> {

    return zip(
      this.contractApiService.load(id),
      this.runtimeService.selectOptions(),
    ).pipe(
      map(([response, options]) => {

        const model = this.jsonapiParserService.parseGetOne<JsonapiContractInterface, ContractModel>(response);

        const step = model.stepId && options.propertyContractStep.find(s => s.value === model.stepId);
        const sellType = model.sellTypeId && options.propertyContractSellType.find(s => s.value === model.sellTypeId);

        model.labelStep = step ? step.text : '';
        model.labelSellType = sellType ? sellType.text : '';
        model.totalCommission = 0;

        // Contract contact
        model.contractContacts = model.contractContacts.map(contractContact => {

          const contact = contractContact.clone<ContractContactModel>();
          const type = options.propertyContractContactType.find(t => t.value === contact.typeId);
          contact.typeLabel = type ? type.text : '';

          return contact;
        });

        // Contract commission
        model.contractCommissions = model.contractCommissions.map(contractCommission => {

          const commission = contractCommission.clone<ContractCommissionModel>();
          const type = options.propertyContractCommissionType.find(t => t.value === commission.typeId);
          commission.typeLabel = type ? type.text : '';

          // Update total commission
          model.totalCommission += Number(commission.amount) * (commission.parentContractCommissionId ? -1 : 1);

          return commission;
        });

        return model;
      }));
  }

  /**
   * @inheritDoc
   */
  save(model: ContractModel): Observable<ModelSaveInterface> {

    return this
      .contractApiService
      .save(model)
      .pipe(
        map(response => { throw response; }),
        catchError(response => {

          const modelSave = this.jsonapiParserService.parseSave<ContractModel>(response, this.moduleConfig.SAVE_VALIDATION_MAPPING);
          const subcalls: Observable<ModelSaveInterface>[] = [];

          // Contract save failed
          if (!response || !response.data || !response.data.id) {

            return of(modelSave);
          }

          // Contacts
          model.contractContacts.forEach((contact, i) => {

            // Delete
            if (contact.isRemoved === true) {

              // Has an ID
              if (contact.id) {

                subcalls.push(
                  this
                    .contractContactApiService
                    .remove(contact.id)
                    .pipe(
                      map(res => { throw res; }),
                      catchError(err => of(modelSave)),
                    ),
                );
              }

              return;
            }

            // Update
            const contractContact = new ContractContactModel();

            Object.keys(contact).forEach(key => contractContact[key] = contact[key]);
            contractContact.contractId = model.id || response.data && response.data.id;

            subcalls.push(
              this
                .contractContactApiService
                .save(contractContact)
                .pipe(
                  map(res => { throw res; }),
                  catchError(res => {

                    const contactModelSave = this
                        .jsonapiParserService
                        .parseSave<ContractContactModel>(res, this.moduleConfig.SAVE_VALIDATION_MAPPING, i);

                    // Model error
                    if (Object.keys(contactModelSave.modelError).length > 0) {

                      modelSave.modelError = {
                        ...modelSave.modelError,
                        ...contactModelSave.modelError,
                      };
                    }

                    // General error
                    contactModelSave.generalError.forEach(generalError => modelSave.generalError.push(generalError));

                    return of(modelSave);
                  }),
                ),
            );
          });

          // Commissions
          subcalls.push(
            this.saveCommissions(model.id || response.data && response.data.id, modelSave, model.contractCommissions, 0),
          );

          return subcalls.length > 0 ? merge(...subcalls).pipe(last()) : of(modelSave);
        }),
      );
  }

  /**
   * Save commissions one by one
   */
  private saveCommissions(
    contractId: string,
    modelSave: ModelSaveInterface,
    contractCommissions: ContractCommissionModel[],
    index: number,
    contractCommissionIdMapping: KeyValueType<string, string> = {},
  ): Observable<ModelSaveInterface> {

    const commission =  contractCommissions[index];

    // Commission not found
    if (!commission) {

      return of(modelSave);
    }

    // Delete and has database ID
    if (commission.isRemoved === true && commission.id && commission.id.indexOf('temp') === -1) {

      return this
        .contractCommissionApiService
        .remove(commission.id)
        .pipe(
          map(res => { throw res; }),
          catchError(err => of(modelSave)),
        );
    }

    // Update
    const contractCommission = new ContractCommissionModel();

    Object.keys(commission).forEach(key => contractCommission[key] = commission[key]);
    contractCommission.id = contractCommission.id.indexOf('temp') > -1 ? '' : contractCommission.id;
    contractCommission.contractId = contractId;
    contractCommission.parentContractCommissionId =
      contractCommissionIdMapping[contractCommission.parentContractCommissionId] || contractCommission.parentContractCommissionId;

    return this
      .contractCommissionApiService
      .save(contractCommission)
      .pipe(
        map(res => { throw res; }),
        catchError(res => {

          // ID mapping
          contractCommissionIdMapping[commission.id] = res && res.data && res.data.id || commission.id;

          const commissionModelSave = this
            .jsonapiParserService
            .parseSave<ContractCommissionModel>(res, this.moduleConfig.SAVE_VALIDATION_MAPPING, index);

          // Model error
          if (Object.keys(commissionModelSave.modelError).length > 0) {

            modelSave.modelError = {
              ...modelSave.modelError,
              ...commissionModelSave.modelError,
            };
          }

          // General error
          commissionModelSave.generalError.forEach(generalError => modelSave.generalError.push(generalError));

          return this.saveCommissions(
            contractId,
            modelSave,
            contractCommissions,
            index + 1,
            contractCommissionIdMapping,
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
    search: ContractSearchModel,
  ): Observable<ModelListInterface<ContractModel>> {

    return zip(
      this.contractApiService.list(pagination, sort, search),
      this.runtimeService.selectOptions(),
      this.runtimeService.selectAgenciesIncludingMls(),
    ).pipe(
      map(([response, options, agencies]) => {

        const list = this.jsonapiParserService.parseGetMany<JsonapiContractInterface, ContractModel>(response);

        list.models.map(model => {

          const step = model.stepId && options.propertyContractStep.find(s => s.value === model.stepId);
          const agency = model.agency.id && agencies.find(a => a.value === model.agency.id);

          model.labelStep = step ? step.text : '';
          model.agency.name = agency ? agency.text : '';

          return model;
        });

        return list;
      }));
  }

  /**
   * @inheritDoc
   */
  ids(filters: ContractSearchModel): Observable<string[]> {

    return of([]);
  }
}
