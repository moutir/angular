import { ModelAbstract } from '../class/model.abstract';
import { FormArrayModelInterface } from '../interface/form-array-model.interface';
import { LanguageEnum } from '../enum/language.enum';

export class SuggestionContentModel extends ModelAbstract implements FormArrayModelInterface {

  id: string = '';
  language: LanguageEnum = LanguageEnum.en;
  title: string = '';
  problem: string = '';
  solution: string = '';
  isComputerTranslated: boolean = false;

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
