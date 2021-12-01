import { ModelAbstract } from '../class/model.abstract';

export class HelpContentModel extends ModelAbstract {
  id: string = '';
  dependencyId: string = '';
  categoryId: string = '';
  categoryLabel: string = '';
  formatId: string = '';
  formatLabel: string = '';
  keyword: string = '';
  order: string = '';
  title: string = '';
  url: string = '';
  htmlContent: string = '';
}
