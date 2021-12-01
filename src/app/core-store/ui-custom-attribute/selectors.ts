import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiCustomAttributeStateInterface } from './state';
import { selectDataOptions } from '../data-runtime/selectors';
import { StateInterface } from '../state.interface';
import { OptionGroupInterface } from '../../shared/interface/option-group.interface';
import { RuntimeOptionsInterface } from '../../shared/interface/runtime-options.interface';
import { CustomAttributeTypeEnum } from '../../shared/enum/custom-attribute-type.enum';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiCustomAttributeStateInterface>
  = createFeatureSelector<UiCustomAttributeStateInterface>(FEATURE_NAME);

/**
 * Select list of custom attribute options for type
 */
export const selectUiCustomAttributeOptions =
  (type: CustomAttributeTypeEnum): MemoizedSelector<StateInterface, OptionGroupInterface[]> => createSelector(
  selectDataOptions,
  (options: RuntimeOptionsInterface): OptionGroupInterface[] => {

    return options.customAttribute
      .filter(c => c.types.indexOf(type) > -1)
      .map(c => ({ label: c.label, options: c.options }))
    ;
  },
);
