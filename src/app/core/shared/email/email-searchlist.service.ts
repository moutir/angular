import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';

import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { EmailModel } from '../../../shared/model/email.model';
import { EmailSearchOptionsInterface } from '../../../shared/interface/email-search-options.interface';
import { selectDataEmailContents, selectDataEmails } from '../../../core-store/data-email/selectors';
import { selectUiForm, selectUiKeywords } from '../../../core-store/ui-searchlist/selectors';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { selectDataAutocompleteOptions } from '../../../core-store/data-autocomplete/selectors';
import { AutocompleteOptionsInterface } from '../../../shared/interface/autocomplete-options.interface';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { EmailSearchModel } from '../../../shared/model/email-search.model';
import { selectDataAuthentication, selectDataOptions, selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { HelperService } from '../helper.service';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { EmailConfig } from './email.config';
import { DateFormatEnum } from '../../../shared/enum/date-format.enum';
import { selectUiBrokerOptions } from '../../../core-store/ui-contact/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { EmailContentModel } from '../../../shared/model/email-content.model';
import { RuntimeAuthenticationInterface } from '../../../shared/interface/runtime-authentication.interface';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class EmailSearchlistService extends SearchlistServiceAbstract<
  EmailModel,
  EmailSearchModel,
  EmailSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: EmailConfig,
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
  getEmptyFilters(): EmailSearchModel {

    return new EmailSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, EmailSearchOptionsInterface> {

    return createSelector(
      selectUiForm(uid),
      selectDataOptions,
      selectDataPermissions,
      selectUiBrokerOptions,
      (
        form: EmailSearchModel,
        options: RuntimeOptionsInterface,
        permissions: PermissionEnum[],
        brokerOptions: OptionInterface[],
      ): EmailSearchOptionsInterface => {

        const filters = {
          subject: [],
          dateFrom: [],
          dateTo: [],
          attachmentTypeId: options.emailAttachmentType,
          statusIds: options.emailStatus,
          brokerIds: permissions.indexOf(PermissionEnum.contactRead) > -1 ? brokerOptions : [],
          contactIds: [],
          propertyIds: [],
          promotionIds: [],
        };

        return filters;
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
        formOptions: EmailSearchOptionsInterface,
        autocompleteOptions: AutocompleteOptionsInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof EmailSearchOptionsInterface;
            isRemovable: boolean;
          };
        } = {
          subject: {
            translation: 'keyword_subject',
            option: 'subject',
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
          attachmentTypeId: {
            translation: 'keyword_attachment_type',
            option: 'attachmentTypeId',
            isRemovable: true,
          },
          brokerIds: {
            translation: 'keyword_sender',
            option: 'brokerIds',
            isRemovable: true,
          },
        };

        return keywords
          .map(keyword => {

            const updatedKeyword = {
              ...keyword,
            };

            // IDs
            if (keyword.name === 'ids') {

              updatedKeyword.translation = 'keyword_id';
            }

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

            // Property IDs
            if (keyword.name === 'propertyIds') {

              updatedKeyword.translation = 'keyword_property';

              if (autocompleteOptions.property[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.property[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            // Promotion IDs
            if (keyword.name === 'promotionIds') {

              updatedKeyword.translation = 'keyword_promotion';

              if (autocompleteOptions.promotion[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.promotion[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            // Recipient IDs
            if (keyword.name === 'contactIds') {

              updatedKeyword.translation = 'keyword_recipient';

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
  protected selectDefaultFilters(): Observable<EmailSearchModel> {

    return this.store$.select(createSelector(
      selectDataAuthentication,
      (
        authentication: RuntimeAuthenticationInterface,
      ): EmailSearchModel => {

        const filters = this.getEmptyFilters();

        filters.brokerIds.push(
          authentication.contactId,
        );

        return filters;
      },
    ));
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultSort(): Observable<SortInterface> {

    return of({
      id: 'sent_date',
      order: OrderEnum.desc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<EmailModel> {

    return selectDataEmails;
  }

  /**
   * @inheritDoc
   */
  selectDataEmailContents(): Observable<Dictionary<EmailContentModel>> {

    return this.store$.select(selectDataEmailContents);
  }
}
