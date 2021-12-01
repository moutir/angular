import { EmailModel } from '../../shared/model/email.model';
import { DataStateInterface } from '../data-state.interface';
import { EmailContentModel } from '../../shared/model/email-content.model';

export const FEATURE_NAME = 'data-email';

export interface DataEmailStateInterface extends DataStateInterface<EmailModel> {

  // Email content data
  emailContent: DataStateInterface<EmailContentModel>;
}

export const initialState: DataEmailStateInterface = {
  models: {},
  emailContent: {
    models: {},
  },
};
