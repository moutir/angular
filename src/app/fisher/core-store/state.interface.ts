import { UiFisherStateInterface } from './ui-fisher/state';
import { DataFisherStateInterface } from './data-fisher/state';
import { DataRuntimeStateInterface } from '../../core-store/data-runtime/state';
import { UiRuntimeStateInterface } from '../../core-store/ui-runtime/state';

export interface StateInterface {

  // Data states
  'data-fisher': DataFisherStateInterface;
  'data-runtime': DataRuntimeStateInterface;

  // UI states
  'ui-fisher': UiFisherStateInterface;
  'ui-runtime': UiRuntimeStateInterface;
}
