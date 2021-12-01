import { ModelAbstract } from '../class/model.abstract';
import { ContactModel } from './contact.model';
import { PropertyModel } from './property.model';
import { PromotionModel } from './promotion.model';
import { MatchingScoreInterface } from '../interface/matching-score.interface';

export class MatchingModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'contact',
    'property',
    'promotion',
  ];

  id: string = '';
  contact: ContactModel = new ContactModel();
  property: PropertyModel|null = new PropertyModel();
  promotion: PromotionModel|null = new PromotionModel();
  duplicateMatchingIds: string[] = [];
  score: MatchingScoreInterface = null;
  matchDate: Date|null = null;
  processDate: Date|null = null;
  comment: string = '';
  transferBrokerId: string = '';
  processMethodId: string = '';
  statusId: string = '';
  labelStatus: string = '';
  labelProcessMethod: string = '';
  labelTransferBroker: string = '';
  labelDuration: string = '';
}
