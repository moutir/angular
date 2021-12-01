import { JsonapiRelationshipInterface } from '../structure/jsonapi-relationship.interface';
import { JsonapiDataInterface } from '../structure/jsonapi-data.interface';
import { JsonapiAgencyInterface } from './jsonapi-agency.interface';
import { JsonapiAccountInterface } from './jsonapi-account.interface';
import { JsonapiPropertyInterface } from './jsonapi-property.interface';
import { JsonapiContractContactInterface } from './jsonapi-contract-contact.interface';
import { JsonapiContractCommissionInterface } from './jsonapi-contract-commission.interface';

export interface JsonapiContractInterface extends JsonapiDataInterface {
  id: string;
  type: 'property_contracts';
  attributes?: {
    reference?: string;
    step?: string;
    sell_type?: string;
    project_date?: string|null;
    offer_date?: string|null;
    agreement_date?: string|null;
    agreement_cooling_off_end_date?: string|null;
    agreement_condition_precedent_date?: string|null;
    forecast_dead_of_sale_scheduled_date?: string|null;
    forecast_dead_of_sale_contract_date?: string|null;
    forecast_dead_of_sale_collected_date?: string|null;
    billing_date?: string|null;
    cancellation_date?: string|null;
    comment?: string;
    price_calculation_type?: string;
    asking_price?: number|null;
    negotiated_price_percentage?: number|null;
    negotiated_price?: number|null;
    deposit_amount_percentage?: number|null;
    deposit_amount?: number|null;
    fees_calculation_type?: string;
    fees?: number|null;
    vat?: number|null;
    fees_amount?: number|null;
    fees_percentage?: number|null;
    funding_personal_contribution?: number|null;
    funding_condition_precedent_date?: string|null;
    funding_mortgage_amount?: number|null;
    funding_accepted_date?: string|null;
    created?: string;
    updated?: string|null;
  };
  relationships?: {
    agency?: JsonapiRelationshipInterface<JsonapiAgencyInterface>;
    actors?: JsonapiRelationshipInterface<JsonapiContractContactInterface[]>;
    commissions?: JsonapiRelationshipInterface<JsonapiContractCommissionInterface[]>;
    property?: JsonapiRelationshipInterface<JsonapiPropertyInterface>;
    created_by?: JsonapiRelationshipInterface<JsonapiAccountInterface>;
    updated_by?: JsonapiRelationshipInterface<JsonapiAccountInterface|null>;
  };
}
