import { KeyValueType } from '../type/key-value.type';

export interface RuntimeFeatureBrochureInterface {
  defaultBrochureTypeId: string;
  mapping: {
    privacyIdToPrivacyType: KeyValueType<string, string>;
    brochureIdToBrochureType: KeyValueType<string, string>;
    brochureIdToPrivacyIds: KeyValueType<string, string[]>;
  };
}
