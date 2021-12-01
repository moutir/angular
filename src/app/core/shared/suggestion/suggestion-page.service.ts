import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { SuggestionConfig } from './suggestion.config';
import { SuggestionModel } from '../../../shared/model/suggestion.model';
import { SuggestionOptionsInterface } from '../../../shared/interface/suggestion-options.interface';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { SuggestionService } from './suggestion.service';
import { MenuInterface } from '../../../shared/interface/menu.interface';
import { selectUiType } from '../../../core-store/ui-page/selectors';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { MenuItemInterface } from '../../../shared/interface/menu-item.interface';
import { selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { Observable } from 'rxjs';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { LanguageEnum } from '../../../shared/enum/language.enum';

@Injectable()
export class SuggestionPageService extends PageServiceAbstract<SuggestionModel, SuggestionOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: SuggestionConfig,
    protected modelService: SuggestionService,
  ) {

    super(
      store$,
      runtimeService,
      router,
      moduleConfig,
      modelService,
    );
  }

  /**
   * @inheritDoc
   */
  redirect(type: PageTypeEnum|null, id: string|null): void {

    // Home
    if (type === null) {

      this.router.navigate(['/dashboard']);
      return;
    }

    return super.redirect(type, id);
  }

  /**
   * @inheritDoc
   */
  selectTabUids(): Observable<PageTabEnum[]> {

    return this.store$.select(createSelector(
      selectUiType,
      selectDataPermissions,
      (
        type: PageTypeEnum,
        permissions: PermissionEnum[],
      ) => {

        if (type === PageTypeEnum.read) {

          return this
            .getReadTabUids()
            .filter(tabUid => {

              // Votes (no WRITE permission, votes remain confidential)
              if (tabUid === PageTabEnum.suggestionReadVote && permissions.indexOf(PermissionEnum.suggestionWrite) === -1) {

                return false;
              }

              return true;
            });
        }

        if (type === PageTypeEnum.write) {

          return this.getWriteTabUids();
        }

        return [];
      },
    ));
  }

  /**
   * @inheritDoc
   */
  protected getModelPageTitle(model: SuggestionModel, language: LanguageEnum): string {

    const languageContent = model.contents.find(content => content.language === language);

    return languageContent && languageContent.title || super.getModelPageTitle(model, language);
  }

  /**
   * @inheritDoc
   */
  protected getSelectorMenu(): MemoizedSelector<StateInterface, MenuInterface> {

    return createSelector(
      selectUiType,
      selectDataPermissions,
      (
        type: PageTypeEnum,
        permissions: PermissionEnum[],
      ): MenuInterface => {

        const items: MenuItemInterface[] = [];

        // Page read with write permission
        if (type === PageTypeEnum.read && permissions.indexOf(this.moduleConfig.PERMISSION_WRITE) > -1) {

          items.push({
            id: 'remove',
            label: 'label_remove',
            icon: 'delete_forever',
            tooltip: 'label_delete_forever',
            isEnabled: true,
            items: [],
          });
        }

        return { items };
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorOptions(): MemoizedSelector<StateInterface, SuggestionOptionsInterface> {

    return createSelector(
      this.runtimeService.getSelectorOptions(),
      (
        runtimeOptions: RuntimeOptionsInterface,
      ) => {

        return {
          suggestionStatusIds: runtimeOptions.suggestionStatusIds,
          suggestionTagIds: runtimeOptions.suggestionTagIds,
          suggestionVoteIds: runtimeOptions.suggestionVoteIds,
          accountTypeIds: runtimeOptions.accountType,
        };
      },
    );
  }
}
