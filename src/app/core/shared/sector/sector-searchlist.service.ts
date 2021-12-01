import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Dictionary } from 'app/shared/class/dictionary';
import { Location } from '@angular/common';

import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { SectorModel } from '../../../shared/model/sector.model';
import { SectorSearchOptionsInterface } from '../../../shared/interface/sector-search-options.interface';
import { SectorSearchModel } from '../../../shared/model/sector-search.model';
import { selectDataSectors } from '../../../core-store/data-sector/selectors';
import { selectUiForm, selectUiKeywords } from '../../../core-store/ui-searchlist/selectors';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { selectDataOptions } from '../../../core-store/data-runtime/selectors';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { SectorConfig } from './sector.config';

@Injectable()
export class SectorSearchlistService extends SearchlistServiceAbstract<
  SectorModel,
  SectorSearchModel,
  SectorSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: SectorConfig,
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
  getEmptyFilters(): SectorSearchModel {

    return new SectorSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, SectorSearchOptionsInterface> {

    return createSelector(
      selectUiForm(uid),
      selectDataOptions,
      (form: SectorSearchModel, options: RuntimeOptionsInterface): SectorSearchOptionsInterface => {

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
  protected selectDefaultFilters(): Observable<SectorSearchModel> {

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
  protected selectDataModels(): (state: StateInterface) => Dictionary<SectorModel> {

    return selectDataSectors;
  }
}
