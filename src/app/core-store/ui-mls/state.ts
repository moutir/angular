export const FEATURE_NAME = 'ui-mls';
import { AgencyModel } from '../../shared/model/agency.model';

export interface UiMlsStateInterface {

  /**
   * Is the agency loading ?
   */
  isLoadingAgency: boolean;

  /**
   * Search query
   */
  searchQuery: string;

  /**
   * Selected agency
   */
  selectedAgency: AgencyModel;
}

export const initialState: UiMlsStateInterface = {
  searchQuery: '',
  selectedAgency: null,
  isLoadingAgency: false,
};
