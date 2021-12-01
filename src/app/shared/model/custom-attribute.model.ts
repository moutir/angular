import { ModelAbstract } from '../class/model.abstract';
import { ContactModel } from './contact.model';
import { CustomAttributeValueModel } from './custom-attribute-value.model';
import { CustomAttributeTypeEnum } from '../enum/custom-attribute-type.enum';

export class CustomAttributeModel extends ModelAbstract {

  readonly MODEL_ATTRIBUTES: string[] = [
    'values',
    'createContact',
    'updateContact',
  ];

  id: string = '';
  name: string = '';
  values: CustomAttributeValueModel[] = [];
  usable: CustomAttributeTypeEnum[] = [];
  createContact: ContactModel = new ContactModel();
  createDate: Date|null = null;
  updateContact: ContactModel = new ContactModel();
  updateDate: Date|null = null;
}
