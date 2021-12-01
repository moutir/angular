import { ModelAbstract } from '../class/model.abstract';
import { RestrictionRuleType } from '../type/restriction-rule.type';
import { FormArrayModelInterface } from '../interface/form-array-model.interface';
import { KeyValueType } from '../type/key-value.type';

export class RestrictionRuleModel extends ModelAbstract implements FormArrayModelInterface {

  id: string = '';
  type: RestrictionRuleType = 'condition';
  attribute: string = '';
  operator: string = '';
  value: string|string[]|null = null;
  format: KeyValueType<string, string> = {};

  // UI usage
  isNew: boolean = false;
  isRemoved: boolean = false;

  /**
   * @inheritDoc
   */
  getOrder(): string {

    return [
      (this.isNew ? '1' : '0'),
      (this.id || '0').padStart(10, '0'),
    ].join(',');
  }
}
