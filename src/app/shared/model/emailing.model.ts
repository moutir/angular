import { ContactModel } from './contact.model';
import { ModelAbstract } from '../class/model.abstract';
import { PropertyModel } from './property.model';
import { PromotionModel } from './promotion.model';
import { KeyValueType } from '../type/key-value.type';
import { LanguageEnum } from '../enum/language.enum';
import { EmailingContentModel } from './emailing-content.model';
import { DocumentModel } from './document.model';
import { Dictionary } from '../class/dictionary';

export class EmailingModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'sender',
    'recipients',
    'recipientsCC',
    'properties',
    'promotions',
    'reminderContact',
    'createContact',
    'updateContact',
  ];

  id: string = '';
  brochureBrokerId: string = '';
  emailTemplateId: string = '2';
  emailContentId: string = '';
  emailBrochureTypeId: string = '';
  emailBrochurePrivacyId: string = '';
  reminderTime: string = '';
  defaultLanguageId: LanguageEnum = LanguageEnum.en;
  replyTo: string = '';
  sender: ContactModel = new ContactModel();
  recipients: ContactModel[] = [];
  recipientsCC: ContactModel[] = [];
  properties: PropertyModel[] = [];
  promotions: PromotionModel[] = [];
  leadIds: string[] = [];
  documents: Dictionary<DocumentModel[]> = {};
  content: KeyValueType<LanguageEnum, EmailingContentModel> = {};
  contactLanguages: LanguageEnum[] = [];
  isCopiedToSender: boolean = true;
  isCopiedToBrokers: boolean = false;
  isPriceHidden: boolean = false;
  isLeadClosed: boolean = true;
  isManageLeadByEmail: boolean = false;
  isReminderAdded: boolean = false;
  reminderContact: ContactModel = new ContactModel();
  reminderDate: Date|null = null;
  createContact: ContactModel = new ContactModel();
  createDate: Date|null = null;
  updateContact: ContactModel = new ContactModel();
  updateDate: Date|null = null;
}
