import { ModelAbstract } from '../class/model.abstract';
import { ContactModel } from './contact.model';
import { EmailTemplateContentModel } from './email-template-content.model';
import { LanguageEnum } from '../enum/language.enum';
import { KeyValueType } from '../type/key-value.type';

export class EmailTemplateModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'createContact',
    'updateContact',
  ];

  id: string = '';
  label: string = '';
  isShared: boolean = true;
  content: KeyValueType<LanguageEnum, EmailTemplateContentModel> = {};
  createContact: ContactModel = new ContactModel();
  createDate: Date|null = null;
  updateContact: ContactModel = new ContactModel();
  updateDate: Date|null = null;
}
