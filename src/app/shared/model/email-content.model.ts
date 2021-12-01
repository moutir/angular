import { Dictionary } from '../class/dictionary';
import { ModelAbstract } from '../class/model.abstract';

export class EmailContentModel extends ModelAbstract {

  /**
   * ID
   */
  id: string = '';

  /**
   * Label for display/list per language
   */
  label: Dictionary<string> = {};

  /**
   * HTML content per language
   */
  subject: Dictionary<string> = {};

  /**
   * HTML content per language
   */
  html: Dictionary<string> = {};
}
