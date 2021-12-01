import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { RestrictionModel } from '../../shared/model/restriction.model';
import { RestrictionOptionsInterface } from '../../shared/interface/restriction-options.interface';
import { RestrictionModelAdapterStrategy } from '../../core/shared/restriction/restriction-model-adapter.strategy';
import { RestrictionRuleType } from '../../shared/type/restriction-rule.type';
import { OptionInterface } from '../../shared/interface/option.interface';
import { RestrictionRuleModel } from '../../shared/model/restriction-rule.model';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { KeyValueType } from '../../shared/type/key-value.type';
import { PermissionEnum } from '../../shared/enum/permission.enum';

@Component({
  selector: 'app-restriction-form-required',
  templateUrl: './restriction-form-required.component.html',
  styleUrls: ['./restriction-form-required.component.scss'],
})
export class RestrictionFormRequiredComponent extends FormComponentAbstract<
  RestrictionModel,
  RestrictionOptionsInterface
> implements OnChanges {

  /**
   * Constants
   */
  readonly RULES: Array<{
    type: RestrictionRuleType;
    formArrayName: string;
  }> = [
    {
      type: 'condition',
      formArrayName: 'conditionRules',
    },
    {
      type: 'validation',
      formArrayName: 'validationRules',
    },
  ];
  readonly AUTOCOMPLETE_ENTITIES_LOCATION: KeyValueType<string, EntityEnum> = {
    'CountryFormatter': EntityEnum.locationCountry,
    'CantonFormatter': EntityEnum.locationCanton,
    'DistrictFormatter': EntityEnum.locationDistrict,
    'ZoneFormatter': EntityEnum.locationZone,
    'CityFormatter': EntityEnum.locationCity,
    'QuarterFormatter': EntityEnum.locationQuarter,
  };

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: RestrictionModelAdapterStrategy,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * @inheritDoc
   */
  protected initialize(): boolean {

    if (super.initialize() === false) {

      return false;
    }

    // New restriction
    if (!this.model.id) {

      // Add one empty rule per rule type
      this.RULES.forEach(rule => {

        // Next cycle
        setTimeout(() => {

          // Add control to form array
          this.addFormArrayChild(
            this.formArray[rule.formArrayName].control,
            rule.formArrayName,
            0,
            this.modelAdapterStrategy.getFormControlConfig(this.model)[rule.formArrayName].formArrayConfig,
          );
        });
      });
    }

    return true;
  }

  /**
   * Return the rule attribute options
   */
  getRuleAttributeOptions(): OptionInterface[] {

    return this.options.attribute[this.model.module] ?
      this.options.attribute[this.model.module] : this.options.attribute[this.options.module[0].value];
  }

  /**
   * Return the rule operator options
   */
  getRuleOperatorOptions(restrictionRule: RestrictionRuleModel): OptionInterface[] {

    const module = this.options.operator[this.model.module] ?
      this.model.module : this.options.module[0].value;

    const attribute = this.options.operator[module][restrictionRule.attribute] ?
      restrictionRule.attribute : this.options.attribute[module][0].value;

    return this.options.operator[module][attribute];
  }

  /**
   * Return the rule input option
   */
  getRuleInputOption(restrictionRule: RestrictionRuleModel): OptionInterface {

    return this.options.input[this.model.module] && this.options.input[this.model.module][restrictionRule.attribute] ?
      this.options.input[this.model.module][restrictionRule.attribute] : { value: '', text: '' };
  }

  /**
   * Changed selection autocomplete location
   */
  onChangeSelectionLocation(selection: AutocompleteSelectionInterface, ruleAttribute: string, index: number): void {

    const path = [ruleAttribute, index, 'value'].join('.');
    const values = Array.isArray(this.formGroup.get(path).value) ? this.formGroup.get(path).value.slice(0) : [];

    // Update value
    values.push(String(selection.id));

    // Update label
    const format = {
      ...this.model[ruleAttribute][index].format,
    };
    format[String(selection.id)] = selection.text;

    // Update input by adding a location
    this.setValue([ruleAttribute, index, 'format'].join('.'), format);
    this.setValue(path, values);
  }

  /**
   * Clicked the remove location button
   */
  onClickRemoveLocation(ruleAttribute: string, ruleIndex: number, valueIndex: number): void {

    const path = [ruleAttribute, ruleIndex, 'value'].join('.');

    // Control form value is not an array
    if (Array.isArray(this.formGroup.get(path).value) === false) {

      return;
    }

    const values = this.formGroup.get(path).value.filter((loc, i) => i !== valueIndex);

    // Update input by removing a location
    this.setValue(path, values);
  }

  /**
   * @inheritDoc
   */
  protected onNextFieldValue(path: string, value: string|string[]): void {

    super.onNextFieldValue(path, value);

    // Update a rule attribute // TODO[later] Improve to propose an event/function on form array individual value update
    const pathChunk = path.split('.');
    if (
      pathChunk.length > 1 &&
      ['conditionRules', 'validationRules'].indexOf(pathChunk[0]) > -1
      && pathChunk[2] === 'attribute'
      && !!this.model[pathChunk[0]][pathChunk[1]]
      && value !== this.model[pathChunk[0]][pathChunk[1]].attribute
    ) {

      // Reset operator & value
      this.setValue([pathChunk[0], pathChunk[1], 'operator'].join('.'), '');
      this.setValue([pathChunk[0], pathChunk[1], 'value'].join('.'), '');
    }
  }
}
