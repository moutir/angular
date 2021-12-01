import { ModelAbstract } from '../class/model.abstract';
import { ContactModel } from './contact.model';
import { EntityEnum } from '../enum/entity.enum';
import { RestrictionRuleModel } from './restriction-rule.model';
import { RestrictionTargetModel } from './restriction-target.model';

export class RestrictionModel extends ModelAbstract {

  readonly MODEL_ATTRIBUTES: string[] = [
    'createContact',
    'updateContact',
    'conditionRules',
    'validationRules',
    'groupTargets',
    'agencyTargets',
    'brokerTargets',
  ];

  id: string = '';
  agencyId: string = '';
  module: EntityEnum = EntityEnum.property;
  createContact: ContactModel = new ContactModel();
  createDate: Date|null = null;
  updateContact: ContactModel = new ContactModel();
  updateDate: Date|null = null;
  name: string = '';
  conditionRules: RestrictionRuleModel[] = [];
  validationRules: RestrictionRuleModel[] = [];
  groupTargets: RestrictionTargetModel[] = [];
  agencyTargets: RestrictionTargetModel[] = [];
  brokerTargets: RestrictionTargetModel[] = [];
  acl: number = 0;
  affectedAgencyIds: string[] = [];
}
