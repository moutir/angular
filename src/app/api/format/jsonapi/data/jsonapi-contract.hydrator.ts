import { ContractModel } from '../../../../shared/model/contract.model';
import { JsonapiHydratorInterface } from '../jsonapi-hydrator.interface';
import { JsonapiContractInterface } from './jsonapi-contract.interface';
import { JsonapiModelStore } from '../jsonapi-model-store';
import { PropertyModel } from '../../../../shared/model/property.model';
import { ContractContactModel } from '../../../../shared/model/contract-contact.model';
import { ContractCommissionModel } from '../../../../shared/model/contract-commission.model';
import { AccountModel } from '../../../../shared/model/account.model';

export class JsonapiContractHydrator implements JsonapiHydratorInterface<JsonapiContractInterface, ContractModel> {

  /**
   * @inheritDoc
   */
  factory(): ContractModel {

    return new ContractModel();
  }

  /**
   * @inheritDoc
   */
  hydrate(
    model: ContractModel,
    data: JsonapiContractInterface,
    modelStore: JsonapiModelStore,
  ): void {

    // Has attributes
    if (data.attributes) {

      model.reference = data.attributes.reference || model.reference;
      model.stepId = data.attributes.step || model.stepId;
      model.sellTypeId = data.attributes.sell_type || model.sellTypeId;
      model.comment =  data.attributes.comment || model.comment;
      model.projectDate = data.attributes.project_date ? new Date(data.attributes.project_date) : model.projectDate;
      model.offerDate = data.attributes.offer_date ? new Date(data.attributes.offer_date) : model.offerDate;
      model.agreementDate = data.attributes.agreement_date ? new Date(data.attributes.agreement_date) : model.agreementDate;
      model.coolingOffEndDate = data.attributes.agreement_cooling_off_end_date ?
        new Date(data.attributes.agreement_cooling_off_end_date) : model.coolingOffEndDate;
      model.scheduleDate = data.attributes.forecast_dead_of_sale_scheduled_date ?
        new Date(data.attributes.forecast_dead_of_sale_scheduled_date) : model.scheduleDate;
      model.contractDate = data.attributes.forecast_dead_of_sale_contract_date ?
        new Date(data.attributes.forecast_dead_of_sale_contract_date) : model.contractDate;
      model.collectionDate = data.attributes.forecast_dead_of_sale_collected_date ?
        new Date(data.attributes.forecast_dead_of_sale_collected_date) : model.collectionDate;
      model.billingDate = data.attributes.billing_date ? new Date(data.attributes.billing_date) : model.billingDate;
      model.cancelDate = data.attributes.cancellation_date ?
        new Date(data.attributes.cancellation_date) : model.cancelDate;
      model.conditionPrecedentDate = data.attributes.agreement_condition_precedent_date ?
        new Date(data.attributes.agreement_condition_precedent_date) : model.conditionPrecedentDate;
      model.isActivePricePercentage =
        data.attributes.price_calculation_type ? data.attributes.price_calculation_type === 'percentage' : model.isActivePricePercentage;
      model.isActiveAgencyFeePercentage =
        data.attributes.fees_calculation_type ? data.attributes.fees_calculation_type === 'percentage' : model.isActiveAgencyFeePercentage;
      model.askingPrice = data.attributes.asking_price || model.askingPrice;
      model.negotiatedPricePercentage = data.attributes.negotiated_price_percentage || model.negotiatedPricePercentage;
      model.negotiatedPrice = data.attributes.negotiated_price || model.negotiatedPrice;
      model.depositAmountPercentage = data.attributes.deposit_amount_percentage || model.depositAmountPercentage;
      model.depositAmount = data.attributes.deposit_amount || model.depositAmount;
      model.agencyFee = data.attributes.fees || model.agencyFee;
      model.agencyVat = data.attributes.vat || model.agencyVat;
      model.agencyFeeVatExcluded = data.attributes.fees_amount || model.agencyFeeVatExcluded;
      model.agencyFeePercentage = data.attributes.fees_percentage || model.agencyFeePercentage;
      model.fundAmountPersonal = data.attributes.funding_personal_contribution || model.fundAmountPersonal;
      model.fundAmountMortgage = data.attributes.funding_mortgage_amount || model.fundAmountMortgage;
      model.fundConditionPrecedentDate = data.attributes.funding_condition_precedent_date ?
        new Date(data.attributes.funding_condition_precedent_date) : model.fundConditionPrecedentDate;
      model.fundAcceptDate = data.attributes.funding_accepted_date ? new Date(data.attributes.funding_accepted_date) : model.fundAcceptDate;

      model.createDate = data.attributes.created ? new Date(data.attributes.created) : model.createDate;
      model.updateDate = data.attributes.updated ? new Date(data.attributes.updated) : model.updateDate;
    }

    // Has no relationships
    if (!data.relationships) {

      return;
    }

    // Relationships
    Object
      .keys(data.relationships)
      .filter(relationship => data.relationships[relationship] !== null && data.relationships[relationship].data !== null)
      .forEach(relationship => {

        // Has relationship agency
        if (relationship === 'agency') {

          model.agency.id = data.relationships.agency.data.id;
        }

        // Has relationship property
        if (relationship === 'property') {

          model.property = modelStore.getModel<PropertyModel>('properties', data.relationships.property.data.id);
        }

        // Has relationship actors
        if (relationship === 'actors') {

          model.contractContacts = [];

          data.relationships.actors.data.forEach(relData => {

            model.contractContacts.push(
              modelStore.getModel<ContractContactModel>('property_contract_actors', relData.id),
            );
          });
        }

        // Has relationship commissions
        if (relationship === 'commissions') {

          model.contractCommissions = [];

          data.relationships.commissions.data.forEach(relData => {

            model.contractCommissions.push(
              modelStore.getModel<ContractCommissionModel>('property_contract_commissions', relData.id),
            );
          });
        }

        // Has relationship created_by
        if (relationship === 'created_by') {

          const accountCreate = modelStore.getModel<AccountModel>('accounts', data.relationships.created_by.data.id);

          model.createContact = accountCreate.contact;
        }

        // Has relationship updated_by
        if (relationship === 'updated_by') {

          const accountUpdate = modelStore.getModel<AccountModel>('accounts', data.relationships.updated_by.data.id);

          model.updateContact = accountUpdate.contact;
        }
      });
  }
}
