import { ModelAbstract } from '../class/model.abstract';
import { ContactModel } from './contact.model';
import { PropertyModel } from './property.model';
import { PromotionModel } from './promotion.model';
import { MatchingModel } from './matching.model';

export class MatchingGroupModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'contact',
    'property',
    'promotion',
    'matchings',
  ];

  id: string = '';
  contact: ContactModel|null = null;
  property: PropertyModel|null = null;
  promotion: PromotionModel|null = null;
  matchings: MatchingModel[] = [];
}
