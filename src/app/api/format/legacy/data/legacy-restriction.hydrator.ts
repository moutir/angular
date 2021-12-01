import { Injectable } from '@angular/core';

import { HelperService } from '../../../../core/shared/helper.service';
import { LegacyRestrictionDataInterface } from './legacy-restriction-data.interface';
import { RestrictionModel } from '../../../../shared/model/restriction.model';
import { LegacyRestrictionRuleDataInterface } from './legacy-restriction-rule-data.interface';
import { RestrictionRuleModel } from '../../../../shared/model/restriction-rule.model';
import { LegacyRestrictionTargetDataInterface } from './legacy-restriction-target-data.interface';
import { RestrictionTargetModel } from '../../../../shared/model/restriction-target.model';
import { LegacyContactHydrator } from './legacy-contact.hydrator';

@Injectable()
export class LegacyRestrictionHydrator {

  /**
   * Constructor
   */
  constructor(
    private legacyContactHydrator: LegacyContactHydrator,
    private helperService: HelperService,
  ) {

  }

  /**
   * Return a RestrictionModel from RestrictionDataInterface
   */
  hydrateModel(data: LegacyRestrictionDataInterface): RestrictionModel {

    const restriction = new RestrictionModel();

    restriction.id = data.id;
    restriction.name = data.name;
    restriction.module = data.module;
    restriction.createDate = this.helperService.stringToDate(data.createDatetime, false);
    restriction.updateDate = this.helperService.stringToDate(data.updateDatetime, false);
    restriction.acl = parseInt(data.acl, 10);
    restriction.affectedAgencyIds = data.affectedAgencyIds;

    if (data.createContact) {

      restriction.createContact = this.legacyContactHydrator.hydrateModel(data.createContact);
    }

    if (data.updateContact) {

      restriction.updateContact = this.legacyContactHydrator.hydrateModel(data.updateContact);
    }

    if (data.conditionRules) {

      restriction.conditionRules = data.conditionRules.map(condition => this.hydrateModelRule(condition));
    }

    if (data.validationRules) {

      restriction.validationRules = data.validationRules.map(validation => this.hydrateModelRule(validation));
    }

    if (data.groupTargets) {

      restriction.groupTargets = data.groupTargets.map(target => this.hydrateModelTarget(target));
    }

    if (data.agencyTargets) {

      restriction.agencyTargets = data.agencyTargets.map(target => this.hydrateModelTarget(target));
    }

    if (data.brokerTargets) {

      restriction.brokerTargets = data.brokerTargets.map(target => this.hydrateModelTarget(target));
    }

    return restriction;
  }

  /**
   * Return a RestrictionDataInterface from RestrictionModel
   */
  hydrateData(model: RestrictionModel): LegacyRestrictionDataInterface {

    const data: LegacyRestrictionDataInterface = {
      id: model.id,
      agencyId: model.agencyId,
      module: model.module,
      createDatetime: null, // Always let backend handle it
      createAccountId:  null, // Always let backend handle it
      createContact: null, // Always let backend handle it
      updateDatetime: null, // Always let backend handle it
      updateAccountId:  null, // Always let backend handle it
      updateContact: null, // Always let backend handle it
      name: model.name,
      conditionRules: model.conditionRules.map(rule => this.hydrateDataRule(rule)),
      validationRules: model.validationRules.map(rule => this.hydrateDataRule(rule)),
      brokerTargets: model.brokerTargets.map(target => this.hydrateDataTarget(target)),
      agencyTargets: model.agencyTargets.map(target => this.hydrateDataTarget(target)),
      groupTargets: model.groupTargets.map(target => this.hydrateDataTarget(target)),
      affectedAgencyIds: [], // Always let backend handle it
      acl: null, // Always let backend handle it
    };

    return data;
  }

  /**
   * Return a RestrictionRuleModel from a RestrictionRuleDataInterface
   */
  private hydrateModelRule(data: LegacyRestrictionRuleDataInterface): RestrictionRuleModel {

    const restrictionRule = new RestrictionRuleModel();

    restrictionRule.id = data.id;
    restrictionRule.type = data.type;
    restrictionRule.attribute = data.attribute;
    restrictionRule.operator = data.operator;
    restrictionRule.value = data.value;
    restrictionRule.format = data.format;
    restrictionRule.isRemoved = data.isRemoved;

    return restrictionRule;
  }

  /**
   * Return a RestrictionTargetModel from a RestrictionTargetDataInterface
   */
  private hydrateModelTarget(data: LegacyRestrictionTargetDataInterface): RestrictionTargetModel {

    const restrictionTarget = new RestrictionTargetModel();

    restrictionTarget.id = data.id;
    restrictionTarget.name = data.name;

    return restrictionTarget;
  }

  /**
   * Return a RestrictionRuleDataInterface from a RestrictionRuleModel
   */
  private hydrateDataRule(model: RestrictionRuleModel): LegacyRestrictionRuleDataInterface {

    return {
      id: model.id,
      type: model.type,
      attribute: model.attribute,
      operator: model.operator,
      value: model.value,
      format: model.format,
      isRemoved: model.isRemoved,
    };
  }

  /**
   * Return a RestrictionTargetDataInterface from a RestrictionTargetModel
   */
  private hydrateDataTarget(model: RestrictionTargetModel): LegacyRestrictionTargetDataInterface {

    return {
      id: model.id,
      name: model.name,
    };
  }
}
