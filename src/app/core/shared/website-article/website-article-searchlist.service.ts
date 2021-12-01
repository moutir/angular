import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';

import { Dictionary } from '../../../shared/class/dictionary';
import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { selectUiKeywords } from '../../../core-store/ui-searchlist/selectors';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { WebsiteArticleConfig } from './website-article.config';
import { WebsiteArticleModel } from '../../../shared/model/website-article.model';
import { WebsiteArticleSearchModel } from '../../../shared/model/website-article-search.model';
import { WebsiteArticleSearchOptionsInterface } from '../../../shared/interface/website-article-search-options.interface';
import { selectDataWebsiteArticles } from '../../../core-store/data-website-article/selectors';
import { selectDataOptions } from '../../../core-store/data-runtime/selectors';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';

@Injectable()
export class WebsiteArticleSearchlistService extends SearchlistServiceAbstract<
  WebsiteArticleModel,
  WebsiteArticleSearchModel,
  WebsiteArticleSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: WebsiteArticleConfig,
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
  getEmptyFilters(): WebsiteArticleSearchModel {

    return new WebsiteArticleSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, WebsiteArticleSearchOptionsInterface> {

    return createSelector(
      selectDataOptions,
      (options: RuntimeOptionsInterface): WebsiteArticleSearchOptionsInterface => {

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
      (keywords: KeywordInterface[]): KeywordInterface[] => {

        return keywords;
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultSort(): Observable<SortInterface> {

    return of({
      id: 'id',
      order: OrderEnum.asc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<WebsiteArticleModel> {

    return selectDataWebsiteArticles;
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultFilters(): Observable<WebsiteArticleSearchModel> {

    return of(this.getEmptyFilters());
  }
}
