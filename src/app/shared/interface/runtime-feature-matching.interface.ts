import { KeyValueType } from '../type/key-value.type';

export interface RuntimeFeatureMatchingInterface {

  /**
   * Matching group type => ID
   */
  emailTemplate: KeyValueType<string, string>;
  emailContent: KeyValueType<string, string>;
  emailBrochureType: KeyValueType<string, string>;
  emailBrochurePrivacy: KeyValueType<string, string>;
}
