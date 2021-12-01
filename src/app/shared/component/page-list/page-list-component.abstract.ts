import { OnDestroy, OnInit } from '@angular/core';
import { concat, Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, filter, take } from 'rxjs/operators';

import { ModelAbstract } from '../../class/model.abstract';
import { ListFiltersInterface } from '../../interface/list-filters.interface';
import { SearchlistServiceAbstract } from '../../service/searchlist.service.abstract';
import { KeywordInterface } from '../../interface/keyword.interface';
import { SearchOptionsInterface } from '../../interface/search-options.interface';
import { BrowserService } from '../../../core/shared/browser/browser.service';
import { ButtonTypeEnum } from '../../enum/button-type.enum';
import { SearchlistSearchInterface } from '../../interface/searchlist-search.interface';
import { PageServiceAbstract } from '../../service/page.service.abstract';
import { PageTypeEnum } from '../../enum/page-type.enum';
import { PageHeaderInterface } from '../../interface/page-header.interface';
import { ChangeFormEventInterface } from '../../interface/change-form-event.interface';
import { MenuItemInterface } from '../../interface/menu-item.interface';
import { RouterService } from '../../../core/shared/router/router.service';

export abstract class PageListComponentAbstract<
  Model extends ModelAbstract,
  Filters extends ListFiltersInterface,
  Options extends SearchOptionsInterface
> implements OnInit, OnDestroy {

  /**
   * State observables
   */
  header$: Observable<PageHeaderInterface>;
  isLoading$: Observable<boolean>;
  keywords$: Observable<KeywordInterface[]>;

  /**
   * @deprecated TODO[later] Should be moved to page-search
   */
  isFormAdvanced$: Observable<boolean>;
  form$: Observable<Filters>;
  formOptions$: Observable<Options>;

  /**
   * Searchlist UID
   */
  uid: string = '';

  /**
   * Observable subscriptions
   */
  protected subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    protected pageService: PageServiceAbstract<Model, {}>,
    protected searchlistService: SearchlistServiceAbstract<Model, Filters, Options>,
    protected browserService: BrowserService,
    protected activatedRoute: ActivatedRoute,
    protected routerService: RouterService,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Set page
    this.pageService.setPage(PageTypeEnum.list, null);

    // Register searchlist (don't remove this crap with pathname until we are fully on Angular!)
    this.uid = this.searchlistService.register(this.browserService.getWindow().location.pathname);

    // Set state observable
    this.setStateObservable();

    // Once required data is loaded (including user preference used for default search)
    this.isLoading$
      .pipe(
        filter(isLoading => isLoading === false),
        take(1),
      )
      .subscribe(isLoading => {

        const previousUrl = this.routerService.getPreviousUrl();
        const currentUrl = this.routerService.getCurrentUrl();
        const regex = new RegExp(('^' + currentUrl + '\/'));

        // Came from READ page
        if (previousUrl.match(regex)) {

          // Submit last search
          this.searchlistService.submitBySearch(this.uid);
        } else {

          // Submit form using route
          this.searchlistService.submitByRoute(this.uid, this.activatedRoute.snapshot.queryParams);
        }

        // Subscribe to active search change
        this.subscriptions.push(
          this.searchlistService.selectSearch(this.uid).subscribe(search => this.onNextSearch(search)),
        );
      });
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Clicked the search button
   *
   * @deprecated TODO[later] Will move to PageSearchComponent
   */
  onClickSearch(): void {

    // Submit form
    this.searchlistService.submitByForm(this.uid);
  }

  /**
   * Clicked the reset button
   *
   * @deprecated TODO[later] Will move to PageSearchComponent
   */
  onClickReset(): void {

    // Reset form
    this.searchlistService.reset(this.uid);
  }

  /**
   * Clicked the save params button
   *
   * @deprecated TODO[later] Will move to PageSearchComponent
   */
  onClickSaveParams(): void {

    // Save search params
    this.searchlistService.saveParams(this.uid);
  }

  /**
   * Changed search form
   *
   * @deprecated TODO[later] Will move to PageSearchComponent
   */
  onChangeForm(event: ChangeFormEventInterface<Model>): void {

    this.searchlistService.updateForm(this.uid, event.input, event.model);
  }

  /**
   * Removed a keyword
   */
  onRemoveKeyword(keyword: KeywordInterface): void {

    // Remove keyword
    this.searchlistService.removeKeyword(this.uid, keyword);
  }

  /**
   * Clicked on the form toggle button
   *
   * @deprecated TODO[later] Will be removed
   */
  onClickFormToggle(): void {

    this.searchlistService.toggleForm(this.uid);
  }

  /**
   * Clicked a button
   */
  onClickButton(buttonType: ButtonTypeEnum): void {

    this.pageService.clickButton(buttonType);
  }

  /**
   * Clicked a menu item
   */
  onClickMenuItem(menuItem: MenuItemInterface): void {

    this.pageService.clickMenuItem(menuItem);
  }

  /**
   * Set state observables
   */
  protected setStateObservable(): void {

    // TODO[nico] Remove from here once page-search implemented everywhere
    this.isFormAdvanced$ = this.searchlistService.selectIsFormAdvanced(this.uid);
    this.form$ = this.searchlistService.selectForm(this.uid);
    this.formOptions$ = this.searchlistService.selectFormOptions(this.uid);

    // Page
    this.header$ = this.pageService.selectHeader();
    this.isLoading$ = this.pageService.selectIsLoading();

    // Searchlist
    this.keywords$ = this.searchlistService.selectKeywords(this.uid);
  }

  /**
   * Changed active search
   */
  protected onNextSearch(search: SearchlistSearchInterface): void {

    // TODO[later] Will be removed after implementing PageSearchComponent

    // Scroll top
    this.browserService.scrollTo(0, 0, 300);

    // Sync browser URL
    this.searchlistService.syncUrl(
      search.filters,
      search.sort,
      search.pagination,
    );

    // Track submitted filters
    this.searchlistService.trackFilters(search.filters);
  }
}
