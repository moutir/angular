import { ModelAbstract } from '../class/model.abstract';
import { PropertyModel } from './property.model';
import { ContactModel } from './contact.model';

export class ReportingModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'property',
    'recipients',
    'processUser',
  ];

  id: string = '';
  property: PropertyModel = new PropertyModel();
  recipients: ContactModel[] = [];
  createDate: Date|null = null;
  fromDate: Date|null = null;
  toDate: Date|null = null;
  frequency: string = '';
  previewUrl: string = '';
  senderContactId: string = '';
  ownerBrokerId: string = '';
  processStatus: string = '';
  processDate: Date|null = null;
  processUser: ContactModel = new ContactModel();
}
