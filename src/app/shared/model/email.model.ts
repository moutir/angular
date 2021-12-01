import { ModelAbstract } from '../class/model.abstract';
import { ContactModel } from './contact.model';
import { PropertyModel } from './property.model';
import { PromotionModel } from './promotion.model';
import { EmailAttachmentInterface } from '../interface/email-attachment.interface';
import { EmailRecipientModel } from './email-recipient.model';

export class EmailModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'sender',
    'realSender',
    'recipients',
    'properties',
    'promotions',
  ];

  id: string = '';
  subject: string = '';
  message: string = '';
  sender: ContactModel = new ContactModel();
  realSender: ContactModel = new ContactModel();
  sentDate: Date|null = null;
  attachments: EmailAttachmentInterface[] = [];
  recipients: EmailRecipientModel[] = [];
  properties: PropertyModel[] = [];
  promotions: PromotionModel[] = [];
  attachmentCount: number = 0;
  deliveredCount: number = 0;
  bouncedCount: number = 0;
  brochureCount: number = 0;
  openedCount: number = 0;
  downloadCount: number = 0;
  promotionCount: number = 0;
  propertyCount: number = 0;
  recipientCount: number = 0;
}
