import { LegacyContactDataInterface } from './legacy-contact-data.interface';

export interface LegacySuggestionVoteDataInterface {
  id: string;
  vote: string;
  createDatetime: string|null;
  createAccountId: string|null;
  createAccountTypeId: string|null;
  createContact: LegacyContactDataInterface|null;
}
