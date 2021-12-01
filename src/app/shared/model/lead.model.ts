import { ModelAbstract } from '../class/model.abstract';
import { ContactModel } from './contact.model';
import { PropertyModel } from './property.model';
import { PromotionModel } from './promotion.model';
import { AgencyModel } from './agency.model';

export class LeadModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'agency',
    'contact',
    'broker',
    'properties',
    'promotions',
    'validationContact',
    'matchingContacts',
    'createContact',
    'updateContact',
  ];

  /**
   * Lead ID
   */
  id: string = '';

  /**
   * Lead type ID
   */
  typeId: string = '';

  /**
   * Lead type label
   */
  typeLabel: string = '';

  /**
   * Lead source ID
   */
  sourceId: string = '';

  /**
   * Lead source label
   */
  sourceLabel: string = '';

  /**
   * Sub source ID
   */
  subSourceId: string = '';

  /**
   * Sub source label
   */
  subSourceLabel: string = '';

  /**
   * Lead status ID
   */
  statusId: string = '';

  /**
   * Lead status label
   */
  statusLabel: string = '';

  /**
   * Media ID
   */
  mediaId: string = '';

  /**
   * Media label
   */
  mediaLabel: string = '';

  /**
   * Management media ID
   */
  managementMediaId: string = '';

  /**
   * Management media label
   */
  managementMediaLabel: string = '';

  /**
   * Original message
   */
  originalMessage: string = '';

  /**
   * Creation date
   */
  createDate: Date|null = null;

  /**
   * Assigned date
   */
  assignDate: Date|null = null;

  /**
   * Contacted date
   */
  contactDate: Date|null = null;

  /**
   * Contacted time
   */
  contactTime: string = '';

  /**
   * Managed date
   */
  manageDate: Date|null = null;

  /**
   * Managed time
   */
  manageTime: string = '';

  /**
   * Update date
   */
  updateDate: Date|null = null;

  /**
   * Created by
   */
  createContact: ContactModel = new ContactModel();

  /**
   * Updated by
   */
  updateContact: ContactModel = new ContactModel();

  /**
   * Agency gateway ID
   */
  agencyGatewayId: string = '';

  /**
   * Agency website ID
   */
  agencyWebsiteId: string = '';

  /**
   * Assigned by ID
   */
  assignedById: string = '';

  /**
   * Contact message
   */
  contactMessage: string = '';

  /**
   * Broker notes
   */
  brokerNotes: string = '';

  /**
   * Lead parser error code
   */
  leadParserErrorCode: string = '';

  /**
   * Lead parser error data
   */
  leadParserErrorData: string = '';

  /**
   * Agency
   */
  agency: AgencyModel = new AgencyModel();

  /**
   * Client
   */
  contact: ContactModel = new ContactModel();

  /**
   * Broker
   */
  broker: ContactModel = new ContactModel();

  /**
   * Matching contacts
   */
  matchingContacts: ContactModel[] = [];

  /**
   * Properties
   */
  properties: PropertyModel[] = [];

  /**
   * Promotions
   */
  promotions: PromotionModel[] = [];

  /**
   * Has email?
   */
  hasEmail: boolean = false;

  /**
   * Has email status?
   */
  hasEmailStatus: boolean = false;

  /**
   * Has email privilege?
   */
  hasEmailPrivilege: boolean = false;

  /**
   * Is allowed to send email?
   */
  isAllowedEmail: boolean = false;

  /**
   * Is validation needed?
   */
  isNeedValidation: boolean = false;

  /**
   * Is the lead readonly?
   */
  isReadonly: boolean = false;

  /**
   * Labels already translated/formatted by BE, used only for display purpose
   */
  labelDurationLevel: string = '';
  labelDuration: string = '';

  /**
   * Lead auto-assign case number from specs https://realforceag.atlassian.net/wiki/spaces/CRM/pages/1110081537/P-022+Lead+auto-assign
   */
  autoAssignCaseNumber: string|null = null;

  // UI usage only
  validationOptionId: number = 3;
  validationContact: ContactModel = new ContactModel();

  /**
   * Return lead's property
   */
  getProperty(): PropertyModel {

    return this.properties[0] || new PropertyModel();
  }

  /**
   * Return lead's promotion
   */
  getPromotion(): PromotionModel {

    return this.promotions[0] || new PromotionModel();
  }
}
