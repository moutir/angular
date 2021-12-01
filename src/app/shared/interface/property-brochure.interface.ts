import { BrochureQualityEnum } from '../enum/brochure-quality.enum';
import { LanguageEnum } from '../enum/language.enum';

export interface PropertyBrochureInterface {
  step: number;
  propertyId: string;
  typeId: string|null;
  type: string|null;
  privacyId: string|null;
  privacy: string|null;
  quality: BrochureQualityEnum;
  language: LanguageEnum;
  brokerId: string|null;
}
