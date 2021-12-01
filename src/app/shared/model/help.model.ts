import { Dictionary } from '../class/dictionary';
import { ModelAbstract } from '../class/model.abstract';
import { HelpContentModel } from './help-content.model';

export class HelpModel extends ModelAbstract {
  id: string = '';
  contents: Dictionary<HelpContentModel[]> = {};
}
