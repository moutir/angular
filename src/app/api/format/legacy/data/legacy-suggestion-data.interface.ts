import { LegacyContactDataInterface } from './legacy-contact-data.interface';
import { LegacySuggestionImageDataInterface } from './legacy-suggestion-image-data.interface';
import { LegacySuggestionTagDataInterface } from './legacy-suggestion-tag-data.interface';
import { LegacySuggestionContentDataInterface } from './legacy-suggestion-content-data.interface';

export interface LegacySuggestionDataInterface {
  id: string;
  createDatetime: string|null;
  createAccountId: string|null;
  createContact: LegacyContactDataInterface|null;
  updateDatetime: string|null;
  updateAccountId: string|null;
  updateContact: LegacyContactDataInterface|null;
  clientBenefit: string;
  realforceBenefit: string;
  complexity: number;
  statusId: string;
  score: number;
  voteCount: number;
  popularity: number;
  isMarketable: boolean;
  isPublished: boolean;
  images: LegacySuggestionImageDataInterface[];
  contents: LegacySuggestionContentDataInterface[];
  tags: LegacySuggestionTagDataInterface[];
  voteId: string|null;
}
