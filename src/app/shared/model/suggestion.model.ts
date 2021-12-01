import { ModelAbstract } from '../class/model.abstract';
import { ContactModel } from './contact.model';
import { SuggestionImageModel } from './suggestion-image.model';
import { SuggestionTagModel } from './suggestion-tag.model';
import { SuggestionContentModel } from './suggestion-content.model';

export class SuggestionModel extends ModelAbstract {

  readonly MODEL_ATTRIBUTES: string[] = [
    'createContact',
    'updateContact',
    'images',
    'contents',
    'tags',
  ];

  id: string = '';
  createContact: ContactModel = new ContactModel();
  createDate: Date|null = null;
  updateContact: ContactModel = new ContactModel();
  updateDate: Date|null = null;
  clientBenefit: string = '';
  realforceBenefit: string = '';
  complexity: number = 1;
  statusId: string|null = null;
  isMarketable: boolean = false;
  isPublished: boolean = false;
  images: SuggestionImageModel[] = [];
  contents: SuggestionContentModel[] = [];
  tags: SuggestionTagModel[] = [];

  // Read only
  score: number = 0;
  voteCount: number = 0;
  popularity: number = 0;
  voteId: string|null = null;

  /**
   * Return the popularity percentage
   */
  getPopularityPercentage(): number {

    return this.popularity / 2 + 50;
  }
}
