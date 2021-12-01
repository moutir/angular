import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Dictionary } from 'app/shared/class/dictionary';
import { Location } from '@angular/common';

import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { CustomAttributeModel } from '../../../shared/model/custom-attribute.model';
import { CustomAttributeSearchOptionsInterface } from '../../../shared/interface/custom-attribute-search-options.interface';
import { CustomAttributeSearchModel } from '../../../shared/model/custom-attribute-search.model';
import { selectDataCustomAttributes } from '../../../core-store/data-custom-attribute/selectors';
import { selectUiForm, selectUiKeywords } from '../../../core-store/ui-searchlist/selectors';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { selectDataOptions } from '../../../core-store/data-runtime/selectors';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { CustomAttributeConfig } from './custom-attribute.config';

@Injectable()
export class CustomAttributeSearchlistService extends SearchlistServiceAbstract<
  CustomAttributeModel,
  CustomAttributeSearchModel,
  CustomAttributeSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: CustomAttributeConfig,
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected trackerService: TrackerService,
    protected location: Location,
    protected ngZone: NgZone,
  ) {

    super(moduleConfig, store$, runtimeService, trackerService, location, ngZone);
  }

  /**
   * @inheritDoc
   */
  getEmptyFilters(): CustomAttributeSearchModel {

    return new CustomAttributeSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, CustomAttributeSearchOptionsInterface> {

    return createSelector(
      selectUiForm(uid),
      selectDataOptions,
      (form: CustomAttributeSearchModel, options: RuntimeOptionsInterface): CustomAttributeSearchOptionsInterface => {

        return {};
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorKeywords(uid: string): MemoizedSelector<StateInterface, KeywordInterface[]> {

    return createSelector(
      selectUiKeywords(uid),
      (
        keywords: KeywordInterface[],
      ): KeywordInterface[] => {

        return keywords
          .map(keyword => {

            const updatedKeyword = {
              ...keyword,
            };

            // Name
            if (keyword.name === 'name') {

              updatedKeyword.translation = 'keyword_text_search';
              updatedKeyword.isRemovable = true;

              return updatedKeyword;
            }

            return updatedKeyword;
          })
          .filter(keyword => keyword !== null)
          .sort((a, b) => {

            const aScore = (a.isRemovable ? 1 : 0);
            const bScore = (b.isRemovable ? 1 : 0);

            return aScore !== bScore ? aScore - bScore : a.name.localeCompare(b.name);
          });
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultFilters(): Observable<CustomAttributeSearchModel> {

    return of(this.getEmptyFilters());
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultSort(): Observable<SortInterface> {

    return of({
      id: 'name',
      order: OrderEnum.asc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<CustomAttributeModel> {

    return selectDataCustomAttributes;
  }
}
