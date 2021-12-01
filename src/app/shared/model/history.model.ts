import { ModelAbstract } from '../class/model.abstract';
import { ContactModel } from './contact.model';

export class HistoryModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'broker',
  ];

  id: string = '';
  date: Date|null = null;
  broker: ContactModel = new ContactModel();
  comment: string = '';
  labelDate: string = '';
  labelTime: string = '';
  link: string = '';
  labelPreviousValues: string = '';
}
