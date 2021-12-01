import { ContactModel } from './contact.model';
import { EmailStatusEnum } from '../enum/email-status.enum';
import { EmailBrochureDownloadInterface } from '../interface/email-brochure-download.interface';

export class EmailRecipientModel extends ContactModel {
  firstOpenDate: Date|null;
  lastOpenDate: Date|null;
  openCount: number;
  downloadCount: number;
  status: EmailStatusEnum;
  statusCode: string;
  statusDate: Date|null;
  statusDescription: string;
  downloadedProperties: EmailBrochureDownloadInterface[] = [];
  downloadedPromotions: EmailBrochureDownloadInterface[] = [];
}
