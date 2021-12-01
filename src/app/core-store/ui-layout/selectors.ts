import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiLayoutStateInterface } from './state';
import { StateInterface } from '../state.interface';
import { SidenavInterface } from '../../shared/interface/sidenav.interface';
import { HeaderSearchInterface } from '../../shared/interface/header-search.interface';
import { selectDataContacts } from '../data-contact/selectors';
import { selectDataProperties } from '../data-property/selectors';
import { selectDataPromotions } from '../data-promotion/selectors';
import { PromotionModel } from '../../shared/model/promotion.model';
import { PropertyModel } from '../../shared/model/property.model';
import { ContactModel } from '../../shared/model/contact.model';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { HeaderSearchResultInterface } from '../../shared/interface/header-search-result.interface';
import { Dictionary } from '../../shared/class/dictionary';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<StateInterface, UiLayoutStateInterface>
  = createFeatureSelector<UiLayoutStateInterface>(FEATURE_NAME);

/**
 * Select header search
 */
export const selectUiSearch: MemoizedSelector<StateInterface, HeaderSearchInterface> = createSelector(
  selectUiState,
  (state: UiLayoutStateInterface): HeaderSearchInterface => state.search,
);

/**
 * Select header search results
 */
export const selectUiSearchResults: MemoizedSelector<StateInterface, HeaderSearchResultInterface> = createSelector(
  selectUiState,
  selectDataContacts,
  selectDataProperties,
  selectDataPromotions,
  (
    state: UiLayoutStateInterface,
    contacts: Dictionary<ContactModel>,
    properties: Dictionary<PropertyModel>,
    promotions: Dictionary<PromotionModel>,
  ): HeaderSearchResultInterface => {

    const results = {
      contact: [],
      property: [],
      promotion: [],
    };

    // For each entity
    Object.keys(state.search.entities).forEach(key => {

      if (key === EntityEnum.contact) {

        results[key] = state.search.entities[key].ids.map(id => contacts[id] || new ContactModel());

        return;
      }

      if (key === EntityEnum.property) {

        results[key] = state.search.entities[key].ids.map(id => properties[id] || new PropertyModel());

        return;
      }

      if (key === EntityEnum.promotion) {

        results[key] = state.search.entities[key].ids.map(id => promotions[id] || new PromotionModel());

        return;
      }
    });

    return results;
  },
);

/**
 * Select sidenav
 */
export const selectUiSidenav: MemoizedSelector<StateInterface, SidenavInterface> = createSelector(
  selectUiState,
  (state: UiLayoutStateInterface): SidenavInterface => state.sidenav,
);
