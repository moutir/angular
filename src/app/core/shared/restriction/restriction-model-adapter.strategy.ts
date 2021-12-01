import { FormGroup, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';

import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { RestrictionModel } from '../../../shared/model/restriction.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { RestrictionTargetModel } from '../../../shared/model/restriction-target.model';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { RestrictionRuleModel } from '../../../shared/model/restriction-rule.model';
import { ifIsNotRemoved } from '../../../shared/validator/if-is-not-removed.validator';
import { FormArrayModelConfigInterface } from '../../../shared/interface/form-array-model-config.interface';

@Injectable()
export class RestrictionModelAdapterStrategy extends FormModelAdapterStrategy<RestrictionModel> {

  /**
   * @inheritDoc
   */
  readonly FORM_ARRAY_MODEL_CONFIG: KeyValueType<string, FormArrayModelConfigInterface> = {
    conditionRules: {
      factory: (): ModelAbstract => new RestrictionRuleModel(),
    },
    validationRules:  {
      factory: (): ModelAbstract => new RestrictionRuleModel(),
    },
  };

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: RestrictionModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      name: {
        value: model.name,
        validators: [Validators.required],
      },
      module: {
        value: model.module,
        validators: [Validators.required],
      },
      groupTargets: {
        value: model.groupTargets.map(target => target.id),
        validators: [],
      },
      agencyTargets: {
        value: model.agencyTargets.map(target => target.id),
        validators: [],
      },
      brokerTargets: {
        value: model.brokerTargets.map(target => target.id),
        validators: [],
      },
      conditionRules: {
        value: model.conditionRules.map(ruleModel => {

          return {
            isRemoved: ruleModel.isRemoved,
            type: ruleModel.type,
            attribute: ruleModel.attribute,
            operator: ruleModel.operator,
            value: ruleModel.value,
            format: ruleModel.format,
          };
        }),
        validators: [],
        formArrayConfig: {
          isRemoved: {
            value: false,
            validators: [],
          },
          type: {
            value: 'condition',
            validators: [ifIsNotRemoved(Validators.required)],
          },
          attribute: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required)],
          },
          operator: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required)],
          },
          value: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required)],
          },
          format: {
            value: {},
            validators: [],
          },
        },
      },
      validationRules: {
        value: model.validationRules.map(ruleModel => {

          return {
            isRemoved: ruleModel.isRemoved,
            type: ruleModel.type,
            attribute: ruleModel.attribute,
            operator: ruleModel.operator,
            value: ruleModel.value,
            format: ruleModel.format,
          };
        }),
        validators: [],
        formArrayConfig: {
          isRemoved: {
            value: false,
            validators: [],
          },
          type: {
            value: 'validation',
            validators: [ifIsNotRemoved(Validators.required)],
          },
          attribute: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required)],
          },
          operator: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required)],
          },
          value: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required)],
          },
          format: {
            value: {},
            validators: [],
          },
        },
      },
    };
  }

  /**
   * @inheritDoc
   */
  getModel(model: RestrictionModel, formGroup: FormGroup, path: string, value: Object|Object[]): RestrictionModel {

    const newModel = super.getModel(model, formGroup, path, value);

    // Target
    if (['brokerTargets', 'agencyTargets', 'groupTargets'].indexOf(path) > -1) {

      newModel[path] = (<string[]>value).map(id => {

        const targetModel = new RestrictionTargetModel();
        targetModel.id = id;

        return targetModel;
      });
    }

    return newModel;
  }
}
