import { OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { ButtonTypeEnum } from '../../enum/button-type.enum';
import { PageServiceAbstract } from '../../service/page.service.abstract';
import { PageTypeEnum } from '../../enum/page-type.enum';
import { PageHeaderInterface } from '../../interface/page-header.interface';
import { ModelAbstract } from '../../class/model.abstract';
import { PageTabEnum } from '../../enum/page-tab.enum';
import { MenuItemInterface } from '../../interface/menu-item.interface';

export abstract class PageReadComponentAbstract<Model extends ModelAbstract, Options> implements OnInit, OnDestroy {

  /**
   * Tab UIDs
   */
  tabUids: PageTabEnum[] = [];

  /**
   * State observables
   */
  header$: Observable<PageHeaderInterface>;
  isLoading$: Observable<boolean>;

  /**
   * State
   */
  model: Model;

  /**
   * Observable subscriptions
   */
  protected subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    protected pageService: PageServiceAbstract<Model, Options>,
    protected activatedRoute: ActivatedRoute,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Set page
    this.pageService.setPage(PageTypeEnum.read, this.activatedRoute.snapshot.params.id || null);

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
   * Changed tab
   */
  onChangeTab(event: MatTabChangeEvent): void {

    // Tab UID set manually in the mat-tab (Example: <mat-tab id="contact-read-profile">)
    const dataTabUid = event.tab.content.origin.nativeElement.parentElement.id;

    const tabUid = dataTabUid || this.tabUids[event.index];

    this.pageService.changeTabUid(tabUid);
  }

  /**
   * Set state observables
   */
  protected setStateObservable(): void {

    this.header$ = this.pageService.selectHeader();
    this.isLoading$ = this.pageService.selectIsLoading();

    // Model
    this.subscriptions.push(
      this.pageService.selectModel().subscribe(model => this.onNextModel(model)),
    );

    // Tabs
    this.subscriptions.push(
      this.pageService.selectTabUids().subscribe(tabUids => this.onNextTabUids(tabUids)),
    );
  }

  /**
   * Next model
   */
  protected onNextModel(model: Model): void {

    this.model = model;
  }

  /**
   * Next tab UIDs
   */
  protected onNextTabUids(tabUids: PageTabEnum[]): void {

    this.tabUids = tabUids;
  }
}
