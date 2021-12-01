import { HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material';

import { ButtonTypeEnum } from '../../enum/button-type.enum';
import { PageServiceAbstract } from '../../service/page.service.abstract';
import { PageTypeEnum } from '../../enum/page-type.enum';
import { PageHeaderInterface } from '../../interface/page-header.interface';
import { ModelAbstract } from '../../class/model.abstract';
import { ChangeFormEventInterface } from '../../interface/change-form-event.interface';
import { PageTabEnum } from '../../enum/page-tab.enum';
import { FormService } from '../../../core/shared/form.service';
import { ErrorFormEventInterface } from '../../interface/error-form-event.interface';
import { MenuItemInterface } from '../../interface/menu-item.interface';
import { CanDeactivateComponentInterface } from '../../interface/can-deactivate-component.interface';
import { KeyValueType } from '../../type/key-value.type';
import { GeneralErrorInterface } from '../../interface/general-error.interface';
import { Dictionary } from '../../class/dictionary';
import { map } from 'rxjs/operators';

export abstract class PageWriteComponentAbstract<Model extends ModelAbstract, Options>
  implements OnInit, OnDestroy, CanDeactivateComponentInterface {

  /**
   * Tab UIDs
   */
  tabUids: PageTabEnum[] = [];

  /**
   * State observables
   */
  header$: Observable<PageHeaderInterface>;
  isLoading$: Observable<boolean>;
  options$: Observable<Options>;
  model$: Observable<Model>;
  modelError$: Observable<Dictionary<string|null>>;
  generalError$: Observable<GeneralErrorInterface[]>;

  /**
   * State
   */
  tabErrorCount: KeyValueType<PageTypeEnum, number> = {};

  /**
   * Is the page pristine ?
   */
  protected isPagePristine: boolean = true;

  /**
   * Map a field name to a tab UID
   */
  protected fieldTabMapping: Dictionary<string> = {};

  /**
   * Observable subscriptions
   */
  protected subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    protected pageService: PageServiceAbstract<Model, Options>,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Set field tab mapping
    this.fieldTabMapping = this.getFieldTabMapping();

    // Set page
    this.pageService.setPage(PageTypeEnum.write, this.activatedRoute.snapshot.params.id || null);

    // Set form
    this.formService.register(
      this.pageService.getUid(PageTypeEnum.write),
    );

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
   * @inheritDoc
   */
  canDeactivate(): Observable<boolean> {

    return this.pageService.selectCanDeactivate();
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
   * Changed form
   */
  onChangeForm(event: ChangeFormEventInterface<Model>): void {

    this.pageService.changeModel(event.model, event.input);
  }

  /**
   * Error in form
   */
  onErrorForm(event: ErrorFormEventInterface): void {

    this.formService.error(
      this.pageService.getUid(PageTypeEnum.write),
      event.name,
      event.error,
    );
  }

  /**
   * Pristine status changed for one of the page's forms
   */
  onPristineForm(isPristine: boolean): void {

    if (isPristine === false) {

      this.pageService.setCanDeactivate(false);
    }
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

    const uid = this.pageService.getUid(PageTypeEnum.write);

    this.header$ = this.pageService.selectHeader();
    this.isLoading$ = this.pageService.selectIsLoading();
    this.options$ = this.pageService.selectOptions();
    this.model$ = this.pageService.selectModel();
    this.modelError$ = this.formService.selectModelError(uid);
    this.generalError$ = this.formService.selectGeneralError(uid);

    // Tabs
    this.subscriptions.push(
      this.pageService.selectTabUids().subscribe(tabUids => this.onNextTabUids(tabUids)),
    );

    // Model error
    this.subscriptions.push(
      this.modelError$.subscribe(error => this.onNextFormModelError(error)),
    );
  }

  /**
   * Get mapping of "field name" to "tab UID"
   */
  protected abstract getFieldTabMapping(): Dictionary<PageTabEnum>;

  /**
   * Next form model error
   */
  protected onNextFormModelError(modelError: KeyValueType<string, string|null>): void {

    // Calculate tab error count
    const tabErrorCount = {};

    this.tabUids.forEach(tabUid => tabErrorCount[tabUid] = 0);

    Object
      .keys(modelError)
      .filter(errorId => !!modelError[errorId] === true)
      .forEach(errorId => {

        // Errors in form array will be counted as model attribute error
        const rootErrorId = errorId.split('.')[0];

        tabErrorCount[this.fieldTabMapping[rootErrorId]]++;
      });

    // Update tab error count
    this.tabErrorCount = tabErrorCount;
  }

  /**
   * Next tab UIDs
   */
  protected onNextTabUids(tabUids: PageTabEnum[]): void {

    this.tabUids = tabUids;
  }

  /**
   * Window unload
   */
  @HostListener('window:beforeunload')
  protected onBeforeUnloadWindow(): boolean {

    return this.isPagePristine;
  }
}
