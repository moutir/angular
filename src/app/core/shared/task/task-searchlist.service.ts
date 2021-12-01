import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';

import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { TaskModel } from '../../../shared/model/task.model';
import { TaskSearchModel } from '../../../shared/model/task-search.model';
import { TaskSearchOptionsInterface } from '../../../shared/interface/task-search-options.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { selectUiKeywords, selectUiSelection } from '../../../core-store/ui-searchlist/selectors';
import {
  selectDataFeatureTask,
  selectDataOptions,
  selectDataPermissions,
  selectDataSettings,
} from '../../../core-store/data-runtime/selectors';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { selectDataAutocompleteOptions } from '../../../core-store/data-autocomplete/selectors';
import { AutocompleteOptionsInterface } from '../../../shared/interface/autocomplete-options.interface';
import { selectDataTasks } from '../../../core-store/data-task/selectors';
import { HelperService } from '../helper.service';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { RuntimeFeatureTaskInterface } from '../../../shared/interface/runtime-feature-task.interface';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { DateFormatEnum } from '../../../shared/enum/date-format.enum';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { TaskConfig } from './task.config';
import { MenuInterface } from '../../../shared/interface/menu.interface';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { ListSelectionInterface } from '../../../shared/interface/list-selection.interface';
import { RuntimeSettingsInterface } from '../../../shared/interface/runtime-settings.interface';
import { OperationEnum } from '../../../shared/enum/operation.enum';
import { selectUiBrokerOptions } from '../../../core-store/ui-contact/selectors';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class TaskSearchlistService extends SearchlistServiceAbstract<
  TaskModel,
  TaskSearchModel,
  TaskSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: TaskConfig,
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected trackerService: TrackerService,
    protected location: Location,
    protected helperService: HelperService,
    protected ngZone: NgZone,
  ) {

    super(moduleConfig, store$, runtimeService, trackerService, location, ngZone);
  }

  /**
   * @inheritDoc
   */
  getEmptyFilters(): TaskSearchModel {

    return new TaskSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorMenuOperation(uid: string): MemoizedSelector<StateInterface, MenuInterface> {

    return createSelector(
      selectUiSelection(uid),
      selectDataPermissions,
      selectDataSettings,
      selectDataTasks,
      (
        selection: ListSelectionInterface,
        permissions: PermissionEnum[],
        runtimeSettings: RuntimeSettingsInterface,
        tasks: Dictionary<TaskModel>,
      ): MenuInterface => {

        const isTaskWithNoContact = selection.ids.length === 1 && tasks[selection.ids[0]].contacts.length === 0;
        const isEnabled = selection.ids.length > 0;
        const menu: MenuInterface = {
          items: [],
        };

        if (permissions.indexOf(PermissionEnum.mailboxWrite) > -1) {

          let tooltip = '';
          const isLimitReached = runtimeSettings.emailLimit > 0 && selection.ids.length > runtimeSettings.emailLimit;

          if (isLimitReached) {

            tooltip = 'tooltip_email_limit';
          } else if (isTaskWithNoContact) {

            tooltip = 'tooltip_task_has_no_clients';
          }

          // Send email
          menu.items.push({
            id: OperationEnum.taskSendEmail,
            label: 'label_email_send',
            isEnabled: isEnabled && isLimitReached === false && isTaskWithNoContact === false,
            icon: 'email',
            tooltip: tooltip,
            items: [],
          });
        }

        if (permissions.indexOf(PermissionEnum.contactWrite) > -1) {

          // Add to contacts basket
          menu.items.push({
            id: OperationEnum.taskAddBasket,
            label: 'label_add_to_contact_basket',
            isEnabled: isEnabled && isTaskWithNoContact === false,
            icon: 'add_shopping_cart',
            tooltip: isTaskWithNoContact ? 'tooltip_task_has_no_clients' : '',
            items: [],
          });
        }

        return menu;
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, TaskSearchOptionsInterface> {

    return createSelector(
      selectDataPermissions,
      selectDataOptions,
      selectUiBrokerOptions,
      (
        permissions: PermissionEnum[],
        options: RuntimeOptionsInterface,
        brokerOptions: OptionInterface[],
      ): TaskSearchOptionsInterface => {

        return {
          typeId: options.taskType,
          dateFrom: [],
          dateTo: [],
          clientIds: [],
          brokerIds: permissions.indexOf(PermissionEnum.contactRead) > -1 ? brokerOptions : [],
          propertyIds: [],
          promotionIds: [],
          statusId: options.taskStatus,
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
      this.getSelectorFormOptions(uid),
      selectDataAutocompleteOptions,
      (
        keywords: KeywordInterface[],
        formOptions: TaskSearchOptionsInterface,
        autocompleteOptions: AutocompleteOptionsInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof TaskSearchOptionsInterface;
            isRemovable: boolean;
          };
        } = {
          type: {
            translation: 'keyword_type',
            option: 'typeId',
            isRemovable: true,
          },
          dateFrom: {
            translation: 'keyword_date_from',
            option: 'dateFrom',
            isRemovable: true,
          },
          dateTo: {
            translation: 'keyword_date_to',
            option: 'dateTo',
            isRemovable: true,
          },
          statusId: {
            translation: 'keyword_status',
            option: 'statusId',
            isRemovable: true,
          },
        };

        return keywords
          .map(keyword => {

            const updatedKeyword = {
              ...keyword,
            };

            // Dates
            if (keyword.name === 'dateFrom' || keyword.name === 'dateTo') {

              if (keyword.value instanceof Date === false && !Date.parse(String(keyword.value))) {

                return null;
              }

              updatedKeyword.value = this.helperService.dateToString(new Date(keyword.value), DateFormatEnum.switzerland);
              updatedKeyword.label = updatedKeyword.value;
            }

            // Keyword name is mapped to a form option
            if (keywordOptionMapping[keyword.name]) {

              updatedKeyword.translation = keywordOptionMapping[keyword.name].translation;

              const label = (<OptionInterface[]>formOptions[keywordOptionMapping[keyword.name].option] || [])
                .find(option => option.value === keyword.value);

              if (label) {

                updatedKeyword.label = label.text;
              }

              updatedKeyword.isRemovable = keywordOptionMapping[keyword.name].isRemovable;

              return updatedKeyword;
            }

            // Property ID
            if (keyword.name === 'propertyIds') {

              updatedKeyword.translation = 'keyword_property';

              if (autocompleteOptions.property[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.property[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            // Promotion ID
            if (keyword.name === 'promotionIds') {

              updatedKeyword.translation = 'keyword_promotion';

              if (autocompleteOptions.promotion[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.promotion[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            // Client IDs
            if (keyword.name === 'clientIds') {

              updatedKeyword.translation = 'keyword_person_concerned';

              if (autocompleteOptions.contact[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.contact[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            // Broker IDs
            if (keyword.name === 'brokerIds') {

              updatedKeyword.translation = 'keyword_main_contact';
              updatedKeyword.isRemovable = true;

              formOptions.brokerIds
                .forEach(option => {

                  if (option.value === keyword.value) {

                    updatedKeyword.label = option.text;
                  }
                });

              return updatedKeyword;
            }

            return updatedKeyword;
          })
          .filter(keyword => keyword !== null)
          .sort((a, b) => {

            const aScore = (a.isRemovable ? 1 : 0);
            const bScore = (b.isRemovable ? 1 : 0);

            return aScore !== bScore ? aScore - bScore : a.name.localeCompare(b.name);
          });
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultFilters(): Observable<TaskSearchModel> {

    return this.store$.select(createSelector(
      selectDataFeatureTask,
      (
        featureTask: RuntimeFeatureTaskInterface,
      ): TaskSearchModel => {

        const filters = this.getEmptyFilters();

        // Set filter "status ID" from task feature
        filters.statusId = featureTask.listDefaultStatusId;

        return filters;
      },
    ));
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultSort(): Observable<SortInterface> {

    return of({
      id: 'date',
      order: OrderEnum.desc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<TaskModel> {

    return selectDataTasks;
  }
}
