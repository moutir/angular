import { LanguageEnum } from '../enum/language.enum';
import { Dictionary } from '../../shared/class/dictionary';

export interface MatchingGroupProposalInterface {
  senderId: string;
  emailTemplateId: string;
  emailContentId: string;
  emailBrochureTypeId: string;
  emailBrochurePrivacyId: string;
  emailContentLanguageId: Dictionary<LanguageEnum>; // Contact ID => language
  emailContentLanguageHtml: Dictionary<string>; // Language ID => html content
}
