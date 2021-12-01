import { OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { ButtonTypeEnum } from '../../enum/button-type.enum';
import { PageServiceAbstract } from '../../service/page.service.abstract';
import { PageTypeEnum } from '../../enum/page-type.enum';
import { PageHeaderInterface } from '../../interface/page-header.interface';
import { SearchlistServiceAbstract } from '../../service/searchlist.service.abstract';
import { ModelAbstract } from '../../class/model.abstract';
import { ListFiltersInterface } from '../../interface/list-filters.interface';
import { SearchOptionsInterface } from '../../interface/search-options.interface';
import { MenuItemInterface } from '../../interface/menu-item.interface';

export abstract class PageSearchComponentAbstract<
  Model extends ModelAbstract,
  Filters extends ListFiltersInterface,
  Options extends SearchOptionsInterface
> implements OnInit, OnDestroy {

  /**
   * State observable
   */
  header$: Observable<PageHeaderInterface>;
  isLoading$: Observable<boolean>;
  form$: Observable<Filters>;
  formOptions$: Observable<Options>;

  /**
   * Form UID (matching the list page)
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
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Set page
    this.pageService.setPage(PageTypeEnum.search, null);

    // Set state observable
    this.setStateObservable();
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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

    // Page
    this.header$ = this.pageService.selectHeader();
    this.isLoading$ = this.pageService.selectIsLoading();

    // Searchlist
    this.uid = this.searchlistService.register('page-list');
    this.form$ = this.searchlistService.selectForm(this.uid);
    this.formOptions$ = this.searchlistService.selectFormOptions(this.uid);
  }
}
