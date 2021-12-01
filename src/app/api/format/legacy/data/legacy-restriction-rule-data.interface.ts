import { RestrictionRuleType } from '../../../../shared/type/restriction-rule.type';
import { KeyValueType } from '../../../../shared/type/key-value.type';

export interface LegacyRestrictionRuleDataInterface {
  id: string;
  type: RestrictionRuleType;
  attribute: string;
  operator: string;
  value: string|string[];
  format: KeyValueType<string, string>;
  isRemoved: boolean;
}
