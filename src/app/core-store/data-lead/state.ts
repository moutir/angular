import { LeadModel } from '../../shared/model/lead.model';
import { OptionInterface } from '../../shared/interface/option.interface';
import { DataStateInterface } from '../data-state.interface';
import { Dictionary } from '../../shared/class/dictionary';

export const FEATURE_NAME = 'data-lead';

export interface DataLeadStateInterface extends DataStateInterface<LeadModel> {

  // Lead sub sources per source ID
  subSourceBySourceId: Dictionary<OptionInterface[]>;
}

export const initialState: DataLeadStateInterface = {
  models: {},
  subSourceBySourceId: {},
};
