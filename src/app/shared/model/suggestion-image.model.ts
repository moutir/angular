import { ModelAbstract } from '../class/model.abstract';
import { FormArrayModelInterface } from '../interface/form-array-model.interface';

export class SuggestionImageModel extends ModelAbstract implements FormArrayModelInterface {

  id: string = '';
  url: string = '';
  label: string = '';

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
