import { Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent, Sort } from '@angular/material';
import { Observable, Subscription } from 'rxjs';

import { PaginationInterface } from '../../interface/pagination.interface';
import { SortInterface } from '../../interface/sort.interface';
import { ContextualInterface } from '../../interface/contextual.interface';
import { ListSelectionTypeEnum } from '../../enum/list-selection-type.enum';
import { ListSelectionInterface } from '../../interface/list-selection.interface';
import { ModelAbstract } from '../../class/model.abstract';
import { ListFiltersInterface } from '../../interface/list-filters.interface';
import { PositionInterface } from '../../interface/position.interface';
import { RuntimeSettingsInterface } from '../../interface/runtime-settings.interface';
import { SearchlistServiceAbstract } from '../../service/searchlist.service.abstract';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { MenuItemInterface } from '../../interface/menu-item.interface';
import { MenuInterface } from '../../interface/menu.interface';
import { SearchOptionsInterface } from '../../interface/search-options.interface';
import { EventContextModelInterface } from '../../interface/event-context-model.interface';
import { EventChangeSelectionModelInterface } from '../../interface/event-change-selection-model.interface';
import { OrderEnum } from '../../enum/order.enum';
import { ModuleConfig } from '../../class/module-config';

export abstract class SearchlistComponentAbstract<
  Model extends ModelAbstract,
  Filters extends ListFiltersInterface,
  Options extends SearchOptionsInterface
> implements OnInit, OnDestroy {

  /**
   * Searchlist UID
   */
  @Input() uid: string = '';

  /**
   * Is the searchlist using single and mass actions ?
   */
  @Input() isUsingActions: boolean = true;

  /**
   * Contextual content UIDs
   */
  uidContextualMenuOperation: string = '';

  /**
   * State observables
   */
  runtimeSettings$: Observable<RuntimeSettingsInterface>;
  runtimeContextual$: Observable<ContextualInterface>;
  models$: Observable<Model[]|null>;
  modelsSelectable$: Observable<Model[]>;
  modelsSelected$: Observable<Model[]>;
  pagination$: Observable<PaginationInterface>;
  sort$: Observable<SortInterface>;
  total$: Observable<number>;
  selection$: Observable<ListSelectionInterface>;
  isSelectedPage$: Observable<boolean>;
  menuOperation$: Observable<MenuInterface>;
  operation$: Observable<string>;
  operationIds$: Observable<string[]>;

  /**
   * Observable subscriptions
   */
  protected subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: ModuleConfig,
    protected searchlistService: SearchlistServiceAbstract<Model, Filters, Options>,
    protected runtimeService: RuntimeService,
    protected router: Router,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Set contextual menu operation UID
    this.uidContextualMenuOperation = this.uid + 'menu-operation';

    // Set state observables
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
   * Changed page number
   */
  onChangePagination(pageEvent: PageEvent): void {

    // Update pagination
    this.searchlistService.updatePagination(
      this.uid,
      {
        page: pageEvent.pageIndex + 1,
        perPage: pageEvent.pageSize,
      },
    );
  }

  /**
   * Changed the sort order
   */
  onChangeSort(sort: Sort): void {

    // Update sort
    this.searchlistService.updateSort(this.uid, {
      id: sort.active,
      order: sort.direction === 'desc' ? OrderEnum.desc : OrderEnum.asc,
    });
  }

  /**
   * Clicked a model
   */
  onClickModel(model: Model): void {

    // TODO[later] emit event, page list should call pageService.redirect once fully on angular
    this.router.navigate(['/' + this.moduleConfig.ENTITY_ROUTE_BASE, model.id]);
  }

  /**
   * Clicked an operation menu item
   */
  onClickMenuItemOperation(menuItem: MenuItemInterface): void {

    this.searchlistService.operation(this.uid, menuItem.id);
  }

  /**
   * Clicked the select action button
   */
  onClickSelectAction(position: PositionInterface): void {

    this.runtimeService.showContextual(this.uidContextualMenuOperation, position.x, position.y);
  }

  /**
   * Opened contextual menu on a model
   */
  onContextModel(event: EventContextModelInterface<Model>): void {

    // Blocked actions
    if (this.isUsingActions === false) {

      return;
    }

    this.searchlistService.contextMenu(this.uid, event.model);
    this.runtimeService.showContextual(this.uidContextualMenuOperation, event.position.x, event.position.y);
  }

  /**
   * Clicked on the select all button
   */
  onClickSelectAll(): void {

    this.updateSelectionType(ListSelectionTypeEnum.all);
  }

  /**
   * Clicked on the select none button
   */
  onClickSelectNone(): void {

    this.updateSelectionType(ListSelectionTypeEnum.none);
  }

  /**
   * Changed header selection
   */
  onChangeSelectionHeader(isSelected: boolean): void {

    this.updateSelectionType(isSelected ? ListSelectionTypeEnum.page : ListSelectionTypeEnum.unpage);
  }

  /**
   * Changed model selection
   */
  onChangeSelectionModel(event: EventChangeSelectionModelInterface<Model>): void {

    this.updateSelectionModel(event.isSelected, event.model);
  }

  /**
   * Set state observables
   */
  protected setStateObservable(): void {

    this.runtimeSettings$ = this.runtimeService.selectSettings();
    this.runtimeContextual$ = this.runtimeService.selectContextual();
    this.models$ = this.searchlistService.selectModels(this.uid);
    this.modelsSelectable$ = this.searchlistService.selectModelsSelectable(this.uid);
    this.modelsSelected$ = this.searchlistService.selectModelsSelected(this.uid);
    this.pagination$ = this.searchlistService.selectPagination(this.uid);
    this.sort$ = this.searchlistService.selectSort(this.uid);
    this.total$ = this.searchlistService.selectTotal(this.uid);
    this.selection$ = this.searchlistService.selectSelection(this.uid);
    this.isSelectedPage$ = this.searchlistService.selectIsSelectedPage(this.uid);
    this.menuOperation$ = this.searchlistService.selectMenuOperation(this.uid);
    this.operation$ = this.searchlistService.selectOperation(this.uid);
    this.operationIds$ = this.searchlistService.selectOperationIds();
  }

  /**
   * Update selection type
   */
  protected updateSelectionType(type: ListSelectionTypeEnum): void {

    this.searchlistService.updateSelectionType(this.uid, type);
  }

  /**
   * Update selection model
   */
  protected updateSelectionModel(isSelected: boolean, model: Model): void {

    this.searchlistService.updateSelectionModel(this.uid, isSelected, model);
  }

  /**
   * Reset current operation
   */
  protected resetOperation(): void {

    this.searchlistService.operation(this.uid, '');
  }
}
