import { SidenavInterface } from '../../shared/interface/sidenav.interface';
import { HeaderSearchInterface } from '../../shared/interface/header-search.interface';

export const FEATURE_NAME = 'ui-layout';

export interface UiLayoutStateInterface {

  // Header search
  search: HeaderSearchInterface;

  // Sidenav
  sidenav: SidenavInterface;
}

export const initialState: UiLayoutStateInterface = {
  search: {
    query: '',
    isActive: false,
    entities: {
      contact: {
        isLoading: false,
        ids: [],
      },
      property: {
        isLoading: false,
        ids: [],
      },
      promotion: {
        isLoading: false,
        ids: [],
      },
    },
  },
  sidenav: {
    uid: '',
    isLoading: false,
  },
};
