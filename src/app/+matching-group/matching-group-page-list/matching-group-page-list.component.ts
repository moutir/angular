import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { MatchingGroupModel } from '../../shared/model/matching-group.model';
import { MatchingGroupSearchOptionsInterface } from '../../shared/interface/matching-group-search-options.interface';
import { MatchingGroupSearchlistService } from '../../core/shared/matching-group/matching-group-searchlist.service';
import { MatchingGroupSearchModel } from '../../shared/model/matching-group-search.model';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { CountState } from '../../layout/shared/count.state';
import { CountStore } from '../../layout/shared/count.store';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { MatchingGroupPageService } from '../../core/shared/matching-group/matching-group-page.service';
import { Dictionary } from '../../shared/class/dictionary';
import { RouterService } from '../../core/shared/router/router.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-matching-group-page-list',
  templateUrl: './matching-group-page-list.component.html',
  styleUrls: ['./matching-group-page-list.component.scss'],
})
export class MatchingGroupPageListComponent extends PageListComponentAbstract<
  MatchingGroupModel,
  MatchingGroupSearchModel,
  MatchingGroupSearchOptionsInterface
> {

  /**
   * State observables
   */
  entity$: Observable<EntityEnum>;
  entityTabIndex$: Observable<number>;
  typeTabIndex$: Observable<number>;

  /**
   * Count per entity tab
   */
  entityTabCount: Dictionary<string> = {};

  /**
   * Constructor
   */
  constructor(
    protected pageService: MatchingGroupPageService,
    protected searchlistService: MatchingGroupSearchlistService,
    protected browserService: BrowserService,
    protected activatedRoute: ActivatedRoute,
    protected countStore: CountStore,
    protected routerService: RouterService,
  ) {

    super(
      pageService,
      searchlistService,
      browserService,
      activatedRoute,
      routerService,
    );
  }

  /**
   * Changed tab
   */
  onChangeTab(optionIndex: number, inputName: string): void {

    this.searchlistService.submitByTab(this.uid, inputName, optionIndex);
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.entity$ = this.searchlistService.selectEntity(this.uid);
    this.entityTabIndex$ = this.searchlistService.selectEntityTabIndex(this.uid)
    this.typeTabIndex$ = this.searchlistService.selectTypeTabIndex(this.uid);

    // Updated count state
    this.subscriptions.push(
      this.countStore.countState$.subscribe(countState => this.onNextCountState(countState)),
    );
  }

  /**
   * Next count state
   */
  private onNextCountState(countState: CountState): void {

    this.entityTabCount['by-contact'] = String(countState.matchingContactCount || '');
    this.entityTabCount['by-property'] = String(countState.matchingPropertyCount || '');
    this.entityTabCount['by-promotion'] = String(countState.matchingPromotionCount || '');
  }
}
