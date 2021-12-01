import { EmailTemplateModel } from '../../shared/model/email-template.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-email-template';

export interface DataEmailTemplateStateInterface extends DataStateInterface<EmailTemplateModel> {

}

export const initialState: DataEmailTemplateStateInterface = {
  models: {},
};
