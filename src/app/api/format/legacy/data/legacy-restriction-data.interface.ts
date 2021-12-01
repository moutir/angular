import { LegacyRestrictionTargetDataInterface } from './legacy-restriction-target-data.interface';
import { LegacyRestrictionRuleDataInterface } from './legacy-restriction-rule-data.interface';
import { EntityEnum } from '../../../../shared/enum/entity.enum';
import { LegacyContactDataInterface } from './legacy-contact-data.interface';

export interface LegacyRestrictionDataInterface {
  id: string;
  agencyId: string;
  module: EntityEnum;
  createDatetime: string|null;
  createAccountId: string|null;
  createContact: LegacyContactDataInterface|null;
  updateDatetime: string|null;
  updateAccountId: string|null;
  updateContact: LegacyContactDataInterface|null;
  name: string;
  conditionRules: LegacyRestrictionRuleDataInterface[];
  validationRules: LegacyRestrictionRuleDataInterface[];
  groupTargets: LegacyRestrictionTargetDataInterface[];
  agencyTargets: LegacyRestrictionTargetDataInterface[];
  brokerTargets: LegacyRestrictionTargetDataInterface[];
  acl: string|null;
  affectedAgencyIds: string[];
}
