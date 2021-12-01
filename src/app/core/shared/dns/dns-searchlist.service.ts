import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';

import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { selectUiForm, selectUiKeywords } from '../../../core-store/ui-searchlist/selectors';
import { selectDataOptions } from '../../../core-store/data-runtime/selectors';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { selectDataDnsRecords } from '../../../core-store/data-dns/selectors';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { DnsConfig } from './dns.config';
import { DnsSearchModel } from '../../../shared/model/dns-search.model';
import { DnsModel } from '../../../shared/model/dns.model';
import { DnsSearchOptionsInterface } from '../../../shared/interface/dns-search-options.interface';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class DnsSearchlistService extends SearchlistServiceAbstract<
  DnsModel,
  DnsSearchModel,
  DnsSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: DnsConfig,
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
  getEmptyFilters(): DnsSearchModel {

    return new DnsSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, DnsSearchOptionsInterface> {

    return createSelector(
      selectUiForm(uid),
      selectDataOptions,
      (
        form: DnsSearchModel,
        options: RuntimeOptionsInterface,
      ): DnsSearchOptionsInterface => {

        return {
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
      (keywords: KeywordInterface[]): KeywordInterface[] => {

        return [];
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
  protected selectDataModels(): (state: StateInterface) => Dictionary<DnsModel> {

    return selectDataDnsRecords;
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultFilters(): Observable<DnsSearchModel> {

    return of(this.getEmptyFilters());
  }
}
