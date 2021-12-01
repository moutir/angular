import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';

import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { LeadModel } from '../../../shared/model/lead.model';
import { LeadSearchModel } from '../../../shared/model/lead-search.model';
import { LeadSearchOptionsInterface } from '../../../shared/interface/lead-search-options.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { selectUiForm, selectUiKeywords } from '../../../core-store/ui-searchlist/selectors';
import { MenuInterface } from '../../../shared/interface/menu.interface';
import { selectDataFeatureLead, selectDataOptions, selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { selectDataAutocompleteOptions } from '../../../core-store/data-autocomplete/selectors';
import { AutocompleteOptionsInterface } from '../../../shared/interface/autocomplete-options.interface';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { selectDataLeads, selectDataSubSourceBySource } from '../../../core-store/data-lead/selectors';
import { DateFormatEnum } from '../../../shared/enum/date-format.enum';
import { HelperService } from '../helper.service';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { RuntimeFeatureLeadInterface } from '../../../shared/interface/runtime-feature-lead.interface';
import { TrackerService } from '../tracker/tracker.service';
import { OperationEnum } from '../../../shared/enum/operation.enum';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { selectUiBrokerOptions } from '../../../core-store/ui-contact/selectors';
import { LeadConfig } from './lead.config';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class LeadSearchlistService extends SearchlistServiceAbstract<
  LeadModel,
  LeadSearchModel,
  LeadSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: LeadConfig,
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
  getEmptyFilters(): LeadSearchModel {

    return new LeadSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorMenuOperation(uid: string): MemoizedSelector<StateInterface, MenuInterface> {

    return createSelector(
      this.getSelectorModelsSelected(uid),
      selectDataPermissions,
      (
        leads: LeadModel[]|null,
        permissions: PermissionEnum[],
      ): MenuInterface => {

        const selectedLeads = leads || [];
        const menu: MenuInterface = {
          items: [],
        };

        if (permissions.indexOf(PermissionEnum.mailboxWrite) > -1) {

          const isEnabled = selectedLeads.every(lead => {

            // Lead is not allowed to send emails
            if (lead.isAllowedEmail === false) {

              return false;
            }

            const propertyId: string = selectedLeads.length > 0 ? selectedLeads[0].getProperty().id : '';

            // Has selected leads but property ID is different
            return (selectedLeads.length > 0 && lead.getProperty().id !== propertyId) === false;
          });

          // Send email
          menu.items.push({
            id: OperationEnum.leadSendEmail,
            label: 'label_send_by_email',
            isEnabled: isEnabled,
            icon: 'email',
            tooltip: isEnabled ? '' : 'tooltip_unable_to_answer_leads_different_properties',
            items: [],
          });
        }

        if (permissions.indexOf(PermissionEnum.leadWrite) > -1) {

          // Send email
          menu.items.push({
            id: OperationEnum.leadModifyStatus,
            label: 'label_update_status',
            isEnabled: selectedLeads.length > 0,
            icon: 'published_with_changes',
            tooltip: '',
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
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, LeadSearchOptionsInterface> {

    return createSelector(
      selectUiForm(uid),
      selectDataOptions,
      selectDataSubSourceBySource,
      selectDataPermissions,
      selectUiBrokerOptions,
      (
        form: LeadSearchModel,
        options: RuntimeOptionsInterface,
        subSourceById: Dictionary<OptionInterface[]>,
        permissions: PermissionEnum[],
        brokerOptions: OptionInterface[],
      ): LeadSearchOptionsInterface => {

        return {
          typeId: options.leadType,
          dateFrom: [],
          dateTo: [],
          clientId: [],
          brokerId: permissions.indexOf(PermissionEnum.contactRead) > -1 ? brokerOptions : [],
          propertyId: [],
          statusIds: options.leadStatus,
          mainSourceId: options.leadSource,
          subSourceId: subSourceById[form.mainSourceId] || [],
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
        formOptions: LeadSearchOptionsInterface,
        autocompleteOptions: AutocompleteOptionsInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof LeadSearchOptionsInterface;
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
          statusIds: {
            translation: 'keyword_status',
            option: 'statusIds',
            isRemovable: true,
          },
          mainSourceId: {
            translation: 'keyword_type',
            option: 'mainSourceId',
            isRemovable: true,
          },
          subSourceId: {
            translation: 'keyword_type',
            option: 'subSourceId',
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

            // Publication IDs
            if (keyword.name === 'brokerId') {

              updatedKeyword.translation = 'keyword_contact';
              updatedKeyword.isRemovable = true;

              formOptions.brokerId
                .forEach(option => {

                  if (option.value === keyword.value) {

                    updatedKeyword.label = option.text;
                  }
                });

              return updatedKeyword;
            }

            // Property ID
            if (keyword.name === 'propertyId') {

              updatedKeyword.translation = 'keyword_property';

              if (autocompleteOptions.property[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.property[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            // Contact ID
            if (keyword.name === 'clientId') {

              updatedKeyword.translation = 'keyword_contact';

              if (autocompleteOptions.contact[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.contact[<string>keyword.value].text;
              }

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
  protected selectDefaultFilters(): Observable<LeadSearchModel> {

    return this.store$.select(createSelector(
      selectDataFeatureLead,
      (
        featureLead: RuntimeFeatureLeadInterface,
      ): LeadSearchModel => {

        const filters = this.getEmptyFilters();

        // Set filter "status ID" from lead feature
        filters.statusIds = featureLead.listDefaultStatusId;

        return filters;
      },
    ));
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultSort(): Observable<SortInterface> {

    return of({
      id: 'contact_date',
      order: OrderEnum.desc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<LeadModel> {

    return selectDataLeads;
  }
}
