import { ModelAbstract } from '../class/model.abstract';
import { ContactModel } from './contact.model';

export class SuggestionVoteModel extends ModelAbstract {

  id: string = '';
  vote: string = '';
  createContact: ContactModel = new ContactModel();
  createDate: Date|null = null;
  createAccountTypeId: string = '';
}
