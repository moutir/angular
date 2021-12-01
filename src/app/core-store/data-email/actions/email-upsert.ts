import { FEATURE_NAME } from '../state';
import { EmailModel } from '../../../shared/model/email.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class EmailUpsert extends UpsertAbstract<EmailModel, DataStateInterface<EmailModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = EmailUpsert.TYPE;
}
