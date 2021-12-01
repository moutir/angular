import { ModelAbstract } from '../class/model.abstract';
import { PropertyModel } from './property.model';
import { ContactModel } from './contact.model';
import { AgencyModel } from './agency.model';
import { ContractContactModel } from './contract-contact.model';
import { ContractCommissionModel } from './contract-commission.model';

export class ContractModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'agency',
    'property',
    'contractContacts',
    'contractCommissions',
    'createContact',
    'updateContact',
  ];

  id: string = '';
  reference: string = '';
  stepId: string = '';
  statusId: string = '';
  sellTypeId: string = '';
  currencyId: string = '';
  currencyLabel: string = 'CHF';
  comment: string = '';
  askingPrice: number = null;
  negotiatedPrice: number = null;
  negotiatedPricePercentage: number = null;
  depositAmount: number = null;
  depositAmountPercentage: number = null;
  agencyFee: number = null;
  agencyFeePercentage: number = 3;
  agencyFeeVatExcluded: number = null;
  agencyVat: number = 7.7;
  totalCommission: number = null;
  isActivePricePercentage: boolean = false;
  isActiveAgencyFeePercentage: boolean = true;
  fundAmountPersonal: number = null;
  fundAmountMortgage: number = null;
  agency: AgencyModel = new AgencyModel();
  property: PropertyModel = new PropertyModel();
  contractContacts: ContractContactModel[] = [];
  contractCommissions: ContractCommissionModel[] = [];
  projectDate: Date|null = null;
  offerDate: Date|null = null;
  agreementDate: Date|null = null;
  coolingOffEndDate: Date|null = null;
  conditionPrecedentDate: Date|null = null;
  scheduleDate: Date|null = null;
  contractDate: Date|null = null;
  billingDate: Date|null = null;
  signDate: Date|null = null;
  collectionDate: Date|null = null;
  cancelDate: Date|null = null;
  fundAcceptDate: Date|null = null;
  fundConditionPrecedentDate: Date|null = null;
  createContact: ContactModel = new ContactModel();
  createDate: Date|null = null;
  updateContact: ContactModel = new ContactModel();
  updateDate: Date|null = null;
  labelSignedPrice: string = '';
  labelStep: string = '';
  labelSellType: string = '';
}
