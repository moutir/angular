import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { RestrictionModel } from '../../../shared/model/restriction.model';
import { RestrictionSearchOptionsInterface } from '../../../shared/interface/restriction-search-options.interface';
import { RestrictionSearchModel } from '../../../shared/model/restriction-search.model';
import { selectDataRestrictions } from '../../../core-store/data-restriction/selectors';
import { selectUiForm, selectUiKeywords } from '../../../core-store/ui-searchlist/selectors';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { RestrictionConfig } from './restriction.config';
import { selectUiModules } from '../../../core-store/ui-restriction/selectors';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class RestrictionSearchlistService extends SearchlistServiceAbstract<
  RestrictionModel,
  RestrictionSearchModel,
  RestrictionSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: RestrictionConfig,
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected trackerService: TrackerService,
    protected location: Location,
    protected ngZone: NgZone,
    private translateService: TranslateService,
  ) {

    super(moduleConfig, store$, runtimeService, trackerService, location, ngZone);
  }

  /**
   * @inheritDoc
   */
  getEmptyFilters(): RestrictionSearchModel {

    return new RestrictionSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, RestrictionSearchOptionsInterface> {

    return createSelector(
      selectUiForm(uid),
      selectUiModules,
      (
        form: RestrictionSearchModel,
        modules: OptionInterface[],
      ): RestrictionSearchOptionsInterface => {

        return {
          module: modules,
        };
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

            // Entity
            if (keyword.name === 'module') {

              updatedKeyword.translation = 'keyword_restriction_module';
              updatedKeyword.label = this.translateService.instant('label_restriction_module_' + keyword.value);
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
  protected selectDefaultFilters(): Observable<RestrictionSearchModel> {

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
  protected selectDataModels(): (state: StateInterface) => Dictionary<RestrictionModel> {

    return selectDataRestrictions;
  }
}
