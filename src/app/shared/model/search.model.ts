import { ModelAbstract } from '../class/model.abstract';
import { ContactModel } from './contact.model';

export class SearchModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'createContact',
    'updateContact',
    'brokerContact',
  ];

  id: string = '';
  createContact: ContactModel = new ContactModel();
  createDate: Date|null = null;
  updateContact: ContactModel = new ContactModel();
  updateDate: Date|null = null;
  contact: ContactModel = new ContactModel();
  title: string = '';
  statusId: string = '';
  brokerContact: ContactModel|null = null;
  notes: string = '';
}
