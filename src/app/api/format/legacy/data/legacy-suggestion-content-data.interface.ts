import { LanguageEnum } from '../../../../shared/enum/language.enum';

export interface LegacySuggestionContentDataInterface {
  id: string;
  language: LanguageEnum;
  title: string;
  problem: string;
  solution: string;
  isComputerTranslated: boolean;
  isRemoved: boolean;
}
