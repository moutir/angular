import { EmailModel } from '../model/email.model';

export interface EmailSummaryInterface {
  step: number;
  email: EmailModel;
}
