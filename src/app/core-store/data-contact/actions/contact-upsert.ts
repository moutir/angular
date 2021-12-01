import { FEATURE_NAME } from '../state';
import { ContactModel } from '../../../shared/model/contact.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class ContactUpsert extends UpsertAbstract<ContactModel, DataStateInterface<ContactModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = ContactUpsert.TYPE;
}
