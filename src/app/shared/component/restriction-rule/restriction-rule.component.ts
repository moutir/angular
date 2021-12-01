import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { RestrictionModel } from '../../model/restriction.model';
import { RestrictionRuleModel } from '../../model/restriction-rule.model';
import { RestrictionRuleType } from '../../type/restriction-rule.type';

@Component({
  selector: 'app-shared-restriction-rule',
  templateUrl: './restriction-rule.component.html',
  styleUrls: ['./restriction-rule.component.scss'],
})
export class RestrictionRuleComponent implements OnChanges {

  /**
   * Restriction to preview or null if not available yet
   */
  @Input() restriction: RestrictionModel|null = null;

  /**
   * Rule type
   */
  @Input() ruleType: RestrictionRuleType|null = null;

  /**
   * List of restriction rules
   */
  restrictionRules: RestrictionRuleModel[] = [];

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (this.restriction && this.ruleType) {

      this.restrictionRules = this.ruleType === 'condition' ? this.restriction.conditionRules : this.restriction.validationRules;
    }
  }

  /**
   * Return the formatted value
   */
  getFormattedValue(rule: RestrictionRuleModel): string {

    const values = Array.isArray(rule.value) ? rule.value : [rule.value];

    return values.map(value => rule.format[value] || value).join(', ');
  }
}
