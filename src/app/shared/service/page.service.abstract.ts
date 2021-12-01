import { Router } from '@angular/router';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ButtonTypeEnum } from '../enum/button-type.enum';
import { StateInterface } from '../../core-store/state.interface';
import { PageTypeEnum } from '../enum/page-type.enum';
import { PageHeaderInterface } from '../interface/page-header.interface';
import { selectDataAuthentication, selectDataLanguageCurrent, selectDataPermissions } from '../../core-store/data-runtime/selectors';
import { PermissionEnum } from '../enum/permission.enum';
import { ModuleConfig } from '../class/module-config';
import {
  selectUiAction,
  selectUiCanDeactivate,
  selectUiEntity,
  selectUiIcon,
  selectUiId,
  selectUiModel,
  selectUiType,
} from '../../core-store/ui-page/selectors';
import { ModelAbstract } from '../class/model.abstract';
import { PageEventOpen } from '../../core-store/ui-page/actions/page-event-open';
import { EntityEnum } from '../enum/entity.enum';
import { PageEventStoreModel } from '../../core-store/ui-page/actions/page-event-store-model';
import { InputFormInterface } from '../interface/input-form.interface';
import { PageEventChangeModel } from '../../core-store/ui-page/actions/page-event-change-model';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { PageEventChangeTabUid } from '../../core-store/ui-page/actions/page-event-change-tab-uid';
import { RuntimeOptionsInterface } from '../interface/runtime-options.interface';
import { PageEventClickButton } from '../../core-store/ui-page/actions/page-event-click-button';
import { ModelServiceAbstract } from './model-service.abstract';
import { PageTabEnum } from '../enum/page-tab.enum';
import { PageActionEnum } from '../enum/page-action.enum';
import { MenuInterface } from '../interface/menu.interface';
import { MenuItemInterface } from '../interface/menu-item.interface';
import { PageEventClickMenuItem } from '../../core-store/ui-page/actions/page-event-click-menu-item';
import { PageUpdateCanDeactivate } from '../../core-store/ui-page/actions/page-update-can-deactivate';
import { ModelSaveInterface } from '../interface/model-save.interface';
import { LanguageEnum } from '../enum/language.enum';
import { RuntimeDataEnum } from '../enum/runtime-data.enum';
import { RuntimeAuthenticationInterface } from '../interface/runtime-authentication.interface';

export abstract class PageServiceAbstract<Model extends ModelAbstract, Options> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: ModuleConfig,
    protected modelService: ModelServiceAbstract<Model>,
  ) {

  }

  /**
   * Return page UID
   */
  getUid(type: PageTypeEnum): string {

    return [this.getEntity(), 'page', type].join('-');
  }

  /**
   * Return list of read tab UIDs
   */
  getReadTabUids(): PageTabEnum[] {

    return this.moduleConfig.READ_TAB_UIDS;
  }

  /**
   * Return list of read tab UIDs
   */
  getWriteTabUids(): PageTabEnum[] {

    return this.moduleConfig.WRITE_TAB_UIDS;
  }

  /**
   * Return the page service entity
   */
  getEntity(): EntityEnum {

    return this.moduleConfig.ENTITY;
  }

  /**
   * Return notification update success
   */
  getNotificationUpdate(): string {

    return 'notification_' + this.getEntity() + '_update';
  }

  /**
   * Set active page type
   */
  setPage(type: PageTypeEnum, id: string|null): void {

    this.store$.dispatch(new PageEventOpen({
      entity: this.getEntity(),
      icon: this.moduleConfig.ICON,
      type: type,
      id: id,
    }));
  }

  /**
   * Set "can deactivate" state
   */
  setCanDeactivate(canDeactivate: boolean): void {

    this.store$.dispatch(
      new PageUpdateCanDeactivate({ canDeactivate }),
    );
  }

  /**
   * Click button type
   */
  clickButton(buttonType: ButtonTypeEnum): void {

    this.store$.dispatch(new PageEventClickButton({
      entity: this.getEntity(),
      buttonType: buttonType,
    }));
  }

  /**
   * Click menu item
   */
  clickMenuItem(menuItem: MenuItemInterface): void {

    this.store$.dispatch(new PageEventClickMenuItem({
      entity: this.getEntity(),
      menuItem: menuItem,
    }));
  }

  /**
   * Redirect to the module's page type
   */
  redirect(type: PageTypeEnum|null, id: string|null): void {

    // Home
    if (type === null) {

      this.router.navigate(['/dashboard']);
      return;
    }

    // List
    const segments = [this.moduleConfig.ENTITY_ROUTE_BASE];

    if (type === PageTypeEnum.search) {

      segments.push('search');
    }

    // Read
    if (type === PageTypeEnum.read) {

      segments.push(id);
    }

    // Edit
    if (type === PageTypeEnum.write && id !== null) {

      segments.push(id);
      segments.push('edit');
    }

    // Add
    if (type === PageTypeEnum.write && id === null) {

      segments.push('add');
    }

    this.router.navigate(['/' + segments.join('/')]);
  }

  /**
   * Store model
   */
  storeModel(): void {

    this.store$.dispatch(
      new PageEventStoreModel({
        entity: this.getEntity(),
      }),
    );
  }

  /**
   * Update tab UID
   */
  changeTabUid(tabUid: PageTabEnum): void {

    this.store$.dispatch(
      new PageEventChangeTabUid({
        entity: this.getEntity(),
        tabUid: tabUid,
      }),
    );
  }

  /**
   * Change model
   */
  changeModel(model: Model, input: InputFormInterface): void {

    this.store$.dispatch(
      new PageEventChangeModel({
        entity: this.getEntity(),
        model: model,
        input: input,
      }),
    );
  }

  /**
   * Select header
   */
  selectHeader(): Observable<PageHeaderInterface> {

    return this.store$.select(
      createSelector(
        selectUiIcon,
        selectUiAction,
        this.getSelectorTitle(),
        this.getSelectorSubtitles(),
        this.getSelectorPrimaryButton(),
        this.getSelectorSecondaryButton(),
        this.getSelectorMenu(),
        (
          icon: string,
          action: PageActionEnum,
          title: string,
          subtitles: string[],
          primaryButton: ButtonTypeEnum|null,
          secondaryButton: ButtonTypeEnum|null,
          menu: MenuInterface,
        ): PageHeaderInterface => {

          const header =  {
            icon: icon,
            title: title,
            subtitles: subtitles,
            buttons: [],
            buttonsLoading: [],
            buttonsDisabled: [],
            menu: menu,
          };

          // Secondary button
          if (secondaryButton !== null) {

            header.buttons.push(secondaryButton);

            // Current action: secondary
            if (action === PageActionEnum.secondary) {

              header.buttonsLoading.push(secondaryButton);
            }
          }

          // Primary button
          if (primaryButton !== null) {

            header.buttons.push(primaryButton);

            // Current action: primary
            if (action === PageActionEnum.primary) {

              header.buttonsLoading.push(primaryButton);
            }
          }

          // Page supports cancel button
          if (this.moduleConfig.IS_SUPPORTING_PAGE_CANCEL) {

            // Cancel button
            header.buttons.push(ButtonTypeEnum.cancel);
          }

          // Is loading page
          if (action === PageActionEnum.loading) {

            // All "none navigation" buttons disabled
            header.buttonsDisabled = header.buttons.filter(button => [
              ButtonTypeEnum.search,
              ButtonTypeEnum.add,
              ButtonTypeEnum.edit,
              ButtonTypeEnum.cancel,
            ].indexOf(button) === -1);
          }

          return header;
        },
      ),
    );
  }

  /**
   * Select selectUiCanDeactivate
   */
  selectCanDeactivate(): Observable<boolean> {

    return this.store$.select(selectUiCanDeactivate);
  }

  /**
   * Select model
   */
  selectModel(): Observable<Model> {

    return this.store$.select(this.getSelectorModel());
  }

  /**
   * Select entity
   */
  selectEntity(): Observable<EntityEnum> {

    return this.store$.select(selectUiEntity);
  }

  /**
   * Select type
   */
  selectType(): Observable<PageTypeEnum> {

    return this.store$.select(selectUiType);
  }

  /**
   * Select action
   */
  selectAction(): Observable<PageActionEnum> {

    return this.store$.select(selectUiAction);
  }

  /**
   * Select options available for any page managing this entity
   */
  selectOptions(): Observable<Options> {

    return this.store$.select(this.getSelectorOptions());
  }

  /**
   * Select page loading state (required data NOT loaded or model NOT loaded)
   */
  selectIsLoading(): Observable<boolean> {

    return combineLatest([
      this.selectType(),
      this.runtimeService.requireData(this.getRequiredData()),
      this.store$.select(selectUiModel),
      this.store$.select(selectUiId),
      this.store$.select(selectUiAction),
    ])
    .pipe(
      map(([type, isLoaded, model, id, action]) => {

        // Page action
        if (action === PageActionEnum.loading) {

          return true;
        }

        // List
        if (type === PageTypeEnum.list) {

          return isLoaded === false;
        }

        // Read or Write
        if (type === PageTypeEnum.read || type === PageTypeEnum.write) {

          return isLoaded === false || !!(id && model === null);
        }

        return false;
      }),
    );
  }

  /**
   * Select list of tab UIDs
   */
  selectTabUids(): Observable<PageTabEnum[]> {

    return this.store$.select(createSelector(
      selectUiType,
      (
        type: PageTypeEnum,
      ) => {

        if (type === PageTypeEnum.read) {

          return this.getReadTabUids();
        }

        if (type === PageTypeEnum.write) {

          return this.getWriteTabUids();
        }

        return [];
      },
    ));
  }

  /**
   * Load model
   */
  load(id: string): Observable<Model> {

    return this.modelService.load(id);
  }

  /**
   * Save model
   */
  save(model: Model): Observable<ModelSaveInterface> {

    return this.modelService.save(model);
  }

  /**
   * Return required data
   */
  protected getRequiredData(): RuntimeDataEnum[] {

    return this.moduleConfig.REQUIRED_DATA;
  }

  /**
   * Return read permission
   */
  protected getPermissionRead(): PermissionEnum {

    return this.moduleConfig.PERMISSION_READ;
  }

  /**
   * Return write permission
   */
  protected getPermissionWrite(): PermissionEnum {

    return this.moduleConfig.PERMISSION_WRITE;
  }

  /**
   * Return a selector of MenuInterface
   */
  protected getSelectorMenu(): MemoizedSelector<StateInterface, MenuInterface> {

    return createSelector(
      selectUiType,
      (
        type: PageTypeEnum,
      ): MenuInterface => {

        const items: MenuItemInterface[] = [];

        // Extend with specific logic per page type

        return { items };
      },
    );
  }

  /**
   * Return a selector of model
   */
  protected getSelectorModel(): MemoizedSelector<StateInterface, Model> {

    return createSelector(
      selectUiModel,
      (model: Model): Model => model || this.modelService.factory(),
    );
  }

  /**
   * Return a selector of options
   */
  protected getSelectorOptions(): MemoizedSelector<StateInterface, Options> {

    return createSelector(
      this.runtimeService.getSelectorOptions(),
      (options: RuntimeOptionsInterface): Options => {

        return <Options>{};
      },
    );
  }

  /**
   * Return the model's page title
   */
  protected getModelPageTitle(model: Model, language: LanguageEnum): string {

    return '#' + model.id;
  }

  /**
   * Return a selector of the page title
   */
  protected getSelectorTitle(): MemoizedSelector<StateInterface, string> {

    return createSelector(
      this.getSelectorModel(),
      selectUiId,
      selectUiType,
      selectUiEntity,
      selectDataPermissions,
      selectDataLanguageCurrent,
      (
        model: Model,
        id: string,
        type: PageTypeEnum,
        entity: EntityEnum,
        permissions: PermissionEnum[],
        language: LanguageEnum,
      ): string => {

        // Page "read" or "write"
        if (
          permissions.indexOf(this.getPermissionRead()) > -1 && id && (type === PageTypeEnum.read || type === PageTypeEnum.write)
        ) {

          return model && model.id ? this.getModelPageTitle(model, language) : 'label_loading_records';
        }

        // Default
        return 'page_header_' + entity;
      },
    );
  }

  /**
   * Return a selector of the page subtitles
   */
  protected getSelectorSubtitles(): MemoizedSelector<StateInterface, string[]> {

    return createSelector(
      selectDataPermissions,
      selectUiType,
      selectUiId,
      (
        permissions: PermissionEnum[],
        type: PageTypeEnum,
        id: string,
      ): string[] => {

        // No read permission
        if (permissions.indexOf(this.getPermissionRead()) === -1) {

          return ['breadcrumb_access_denied'];
        }

        switch (type) {

          // Search page
          case PageTypeEnum.search:
            return ['breadcrumb_search'];

          // Read page
          case PageTypeEnum.read:
            return ['breadcrumb_preview'];

          // Write page
          case PageTypeEnum.write:
            return [id ? 'breadcrumb_edit' : 'breadcrumb_add'];

          // List page
          case PageTypeEnum.list:
            return ['breadcrumb_list'];

          // Loading
          case PageTypeEnum.loading:
          default:
            return ['breadcrumb_wait'];
        }
      },
    );
  }

  /**
   * Return a selector of the primary button
   */
  protected getSelectorPrimaryButton(): MemoizedSelector<StateInterface, ButtonTypeEnum|null> {

    return createSelector(
      selectUiType,
      selectDataPermissions,
      this.getSelectorModel(),
      selectDataAuthentication,
      (
        type: PageTypeEnum,
        permissions: PermissionEnum[],
        model: Model,
        authentication: RuntimeAuthenticationInterface,
      ): ButtonTypeEnum|null => {

        // Page list
        if (
          type === PageTypeEnum.list &&
          this.moduleConfig.IS_SUPPORTING_PAGE_ADD === true &&
          permissions.indexOf(this.getPermissionWrite()) > -1
        ) {

          return ButtonTypeEnum.add;
        }

        // Page search
        if (type === PageTypeEnum.search) {

          return ButtonTypeEnum.searchSubmit;
        }

        if (this.isAllowedWriteModel(model, permissions, authentication) === false) {

          return null;
        }

        // Page read
        if (type === PageTypeEnum.read) {

          return ButtonTypeEnum.edit;
        }

        // Page write
        if (type === PageTypeEnum.write) {

          return ButtonTypeEnum.save;
        }

        return null;
      },
    );
  }

  /**
   * Return a selector of the secondary button
   */
  protected getSelectorSecondaryButton(): MemoizedSelector<StateInterface, ButtonTypeEnum|null> {

    return createSelector(
      selectUiType,
      this.getSelectorMenu(),
      (
        type: PageTypeEnum,
        menu: MenuInterface,
      ): ButtonTypeEnum|null => {

        // Page list
        if (type === PageTypeEnum.list) {

          if (this.moduleConfig.IS_SUPPORTING_PAGE_SEARCH === true) {

            return ButtonTypeEnum.search;
          }

        // Has menu (page list must never have a menu)
        } else if (menu.items.length > 0) {

          return ButtonTypeEnum.menu;
        }

        return null;
      },
    );
  }

  /**
   * Return true if user is allowed to write the model
   */
  protected isAllowedWriteModel(model: Model, permissions: PermissionEnum[], authentication: RuntimeAuthenticationInterface): boolean {

    return permissions.indexOf(this.getPermissionWrite()) > -1;
  }
}
