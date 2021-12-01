import { FEATURE_NAME } from '../state';
import { EmailTemplateModel } from '../../../shared/model/email-template.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class EmailTemplateUpsert extends UpsertAbstract<EmailTemplateModel, DataStateInterface<EmailTemplateModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = EmailTemplateUpsert.TYPE;
}
