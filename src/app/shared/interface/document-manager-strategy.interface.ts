import { OptionInterface } from './option.interface';
import { DocumentInputInterface } from './document-input.interface';
import { Dictionary } from '../class/dictionary';

export interface DocumentManagerStrategyInterface {

  /**
   * Dictionary of lists of options
   */
  options: Dictionary<OptionInterface[]>;

  /**
   * List of inputs
   */
  inputs: DocumentInputInterface[];
}
