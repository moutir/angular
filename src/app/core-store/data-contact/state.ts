import { ContactModel } from '../../shared/model/contact.model';
import { DataStateInterface } from '../data-state.interface';
import { Dictionary } from '../../shared/class/dictionary';

export const FEATURE_NAME = 'data-contact';

export interface DataContactStateInterface extends DataStateInterface<ContactModel> {

  // Contact IDs per agency ID
  byAgencyId: Dictionary<string[]>;
}

export const initialState: DataContactStateInterface = {
  models: {},
  byAgencyId: {},
};
