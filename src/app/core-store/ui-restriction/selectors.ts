import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiRestrictionStateInterface } from './state';
import { StateInterface } from '../state.interface';
import { RestrictionModel } from '../../shared/model/restriction.model';
import { selectDataRestrictions } from '../data-restriction/selectors';
import { Dictionary } from '../../shared/class/dictionary';
import { OptionInterface } from '../../shared/interface/option.interface';
import { selectDataFeatureRestriction } from '../data-runtime/selectors';
import { RuntimeFeatureRestrictionInterface } from '../../shared/interface/runtime-feature-restriction.interface';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiRestrictionStateInterface>
  = createFeatureSelector<UiRestrictionStateInterface>(FEATURE_NAME);

/**
 * Select the restriction to preview
 */
export const selectUiPreviewRestriction: MemoizedSelector<StateInterface, RestrictionModel|null> = createSelector(
  selectDataRestrictions,
  selectUiState,
  (
    restrictions: Dictionary<RestrictionModel>,
    state: UiRestrictionStateInterface,
  ): RestrictionModel|null => restrictions[state.previewRestrictionId] || null,
);

/**
 * Select modules
 */
export const selectUiModules = createSelector(
  selectDataFeatureRestriction,
  (featureRestriction: RuntimeFeatureRestrictionInterface): OptionInterface[] => {

    const options = [];

    Object
      .keys(featureRestriction.rules)
      .forEach(module => {

        options.push({
          value: module,
          text: 'label_restriction_module_' + module,
        });
      });

    return options;
  },
);
