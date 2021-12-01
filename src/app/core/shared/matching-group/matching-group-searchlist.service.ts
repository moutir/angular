import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';

import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { MatchingGroupModel } from '../../../shared/model/matching-group.model';
import { MatchingGroupSearchOptionsInterface } from '../../../shared/interface/matching-group-search-options.interface';
import {
  selectUiActionLabel,
  selectUiActionMenuItems,
  selectUiActionSelection,
  selectUiMatchingGroupType,
  selectUiProposal,
  selectUiProposalOptions,
  selectUiToggle,
} from '../../../core-store/ui-matching-group/selectors';
import { MatchingGroupActionSelectionInterface } from '../../../shared/interface/matching-group-action-selection.interface';
import { MatchingGroupEventAction } from '../../../core-store/ui-matching-group/actions/matching-group-event-action';
import { MatchingGroupActionLabelInterface } from '../../../shared/interface/matching-group-action-label.interface';
import { MatchingGroupEventPrepare } from '../../../core-store/ui-matching-group/actions/matching-group-event-prepare';
import { MatchingGroupEventProcess } from '../../../core-store/ui-matching-group/actions/matching-group-event-process';
import { MatchingGroupProposalInterface } from '../../../shared/interface/matching-group-proposal.interface';
import { MatchingGroupProposalOptionsInterface } from '../../../shared/interface/matching-group-proposal-options.interface';
import { InputFormInterface } from '../../../shared/interface/input-form.interface';
import { MatchingGroupEventChangeInputProposal } from '../../../core-store/ui-matching-group/actions/matching-group-event-change-input-proposal';
import { MenuInterface } from '../../../shared/interface/menu.interface';
import { MatchingGroupActionMenuInterface } from '../../../shared/interface/matching-group-action-menu.interface';
import { MatchingGroupUpdateActionMenu } from '../../../core-store/ui-matching-group/actions/matching-group-update-action-menu';
import { MatchingGroupEventToggle } from '../../../core-store/ui-matching-group/actions/matching-group-event-toggle';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { MatchingGroupSearchModel } from '../../../shared/model/matching-group-search.model';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { selectDataMatchingGroups } from '../../../core-store/data-matching-group/selectors';
import { selectUiForm, selectUiKeywords } from '../../../core-store/ui-searchlist/selectors';
import { selectDataOptions } from '../../../core-store/data-runtime/selectors';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { selectDataAutocompleteOptions } from '../../../core-store/data-autocomplete/selectors';
import { AutocompleteOptionsInterface } from '../../../shared/interface/autocomplete-options.interface';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { MatchingGroupConfig } from './matching-group.config';

@Injectable()
export class MatchingGroupSearchlistService extends SearchlistServiceAbstract<
  MatchingGroupModel,
  MatchingGroupSearchModel,
  MatchingGroupSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: MatchingGroupConfig,
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected trackerService: TrackerService,
    protected location: Location,
    protected ngZone: NgZone,
  ) {

    super(moduleConfig, store$, runtimeService, trackerService, location, ngZone);
  }

  /**
   * @inheritDoc
   */
  getEmptyFilters(): MatchingGroupSearchModel {

    return new MatchingGroupSearchModel();
  }

  /**
   * Select the entity
   */
  selectEntity(uid: string): Observable<EntityEnum> {

    return this.store$.select(
      createSelector(
        selectUiForm(uid),
        (form: MatchingGroupSearchModel): EntityEnum|null => {

          switch (form.matchingGroupEntity) {

            case 'by-contact':
              return EntityEnum.contact;

            case 'by-property':
              return EntityEnum.property;

            case 'by-promotion':
              return EntityEnum.promotion;
          }

          return null;
        },
      ),
    );
  }

  /**
   * Select the entity tab index
   */
  selectEntityTabIndex(uid: string): Observable<number> {

    return this.store$.select(
      createSelector(
        selectUiForm(uid),
        this.getSelectorFormOptions(uid),
        (
          form: MatchingGroupSearchModel,
          formOptions: MatchingGroupSearchOptionsInterface,
        ): number => {

          const index = formOptions.matchingGroupEntity
            .map(option => option.value)
            .indexOf(form.matchingGroupEntity);

          return index === -1 ? 0 : index;
        },
      ),
    );
  }

  /**
   * Select the type tab index
   */
  selectTypeTabIndex(uid: string): Observable<number> {

    return this.store$.select(
      createSelector(
        selectUiForm(uid),
        this.getSelectorFormOptions(uid),
        (
          form: MatchingGroupSearchModel,
          formOptions: MatchingGroupSearchOptionsInterface,
        ): number => {

          const index = formOptions.matchingGroupType
            .map(option => option.value)
            .indexOf(form.matchingGroupType);

          return index === -1 ? 0 : index;
        },
      ),
    );
  }

  /**
   * Select the action labels
   */
  selectActionLabel(): Observable<Dictionary<MatchingGroupActionLabelInterface>> {

    return this.store$.select(selectUiActionLabel);
  }

  /**
   * Select the action selection
   */
  selectActionSelection(): Observable<Dictionary<MatchingGroupActionSelectionInterface>> {

    return this.store$.select(selectUiActionSelection);
  }

  /**
   * Select action menu items
   */
  selectActionMenuItems(): Observable<MenuInterface> {

    return this.store$.select(selectUiActionMenuItems);
  }

  /**
   * Select proposal
   */
  selectProposal(): Observable<MatchingGroupProposalInterface> {

    return this.store$.select(selectUiProposal);
  }

  /**
   * Select proposal options
   */
  selectProposalOptions(): Observable<MatchingGroupProposalOptionsInterface> {

    return this.store$.select(selectUiProposalOptions);
  }

  /**
   * Select toggle
   */
  selectToggle(): Observable<Dictionary<boolean>> {

    return this.store$.select(selectUiToggle);
  }

  /**
   * Select matching group type
   */
  selectMatchingGroupType(uid: string): Observable<string> {

    return this.store$.select(selectUiMatchingGroupType(uid));
  }

  /**
   * Select data matching group
   */
  selectDataMatchingGroup(): Observable<Dictionary<MatchingGroupModel>> {

    return this.store$.select(selectDataMatchingGroups);
  }

  /**
   * Set single action
   */
  action(uid: string, action: MatchingGroupActionSelectionInterface): void {

    this.store$.dispatch(
      new MatchingGroupEventAction({
        uid,
        action,
      }),
    );
  }

  /**
   * Prepare actions
   */
  prepare(uid: string): void {

    this.store$.dispatch(
      new MatchingGroupEventPrepare({ uid }),
    );
  }

  /**
   * Process actions
   */
  process(uid: string): void {

    this.store$.dispatch(
      new MatchingGroupEventProcess({ uid }),
    );
  }

  /**
   * Display action menu at the given position
   */
  openActionMenu(actionMenu: MatchingGroupActionMenuInterface): void {

    this.store$.dispatch(
      new MatchingGroupUpdateActionMenu({ actionMenu }),
    );
  }

  /**
   * Update proposal input
   */
  updateProposalInput(input: InputFormInterface): void {

    this.store$.dispatch(
      new MatchingGroupEventChangeInputProposal({ input }),
    );
  }

  /**
   * Toggle fold/unfold
   */
  toggle(matchingGroupId: string, isUnfold: boolean): void {

    this.store$.dispatch(
      new MatchingGroupEventToggle({
        matchingGroupId,
        isUnfold,
      }),
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, MatchingGroupSearchOptionsInterface> {

    return createSelector(
      selectUiForm(uid),
      selectDataOptions,
      (
        form: MatchingGroupSearchModel,
        options: RuntimeOptionsInterface,
      ): MatchingGroupSearchOptionsInterface => {

        return {
          matchingGroupEntity: options.matchingGroupEntity,
          matchingGroupType: options.matchingGroupType,
          brokerId: options.brokerByAgency,
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
        formOptions: MatchingGroupSearchOptionsInterface,
        autocompleteOptions: AutocompleteOptionsInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof MatchingGroupSearchOptionsInterface;
            isRemovable: boolean;
          };
        } = {
          matchingGroupEntity: {
            translation: 'keyword_matching_group_entity',
            option: 'matchingGroupEntity',
            isRemovable: false,
          },
          matchingGroupType: {
            translation: 'keyword_matching_group_type',
            option: 'matchingGroupType',
            isRemovable: false,
          },
        };

        return keywords
          .filter(keyword => {

            // Removed keyword "matchingGroupType" until backend filter is implemented
            return keyword.name !== 'matchingGroupType';
          })
          .map(keyword => {

            const updatedKeyword = {
              ...keyword,
            };

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
            if (keyword.name === 'propertyId') {

              updatedKeyword.translation = 'keyword_property';

              if (autocompleteOptions.property[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.property[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            // Contact ID
            if (keyword.name === 'contactId') {

              updatedKeyword.translation = 'keyword_contact';

              if (autocompleteOptions.contact[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.contact[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            // Property broker ID
            if (keyword.name === 'propertyBrokerId') {

              updatedKeyword.translation = 'keyword_broker_for_property';
              updatedKeyword.isRemovable = true;

              formOptions.brokerId
                .some(optionGroup => {

                  const label = optionGroup.options.find(option => option.value === keyword.value);

                  if (label) {

                    updatedKeyword.label = label.text;
                  }

                  return !!label;
                });

              return updatedKeyword;
            }

            // Contact broker ID
            if (keyword.name === 'contactBrokerId') {

              updatedKeyword.translation = 'keyword_broker_for_contact';
              updatedKeyword.isRemovable = true;

              formOptions.brokerId
                .some(optionGroup => {

                  const label = optionGroup.options.find(option => option.value === keyword.value);

                  if (label) {

                    updatedKeyword.label = label.text;
                  }

                  return !!label;
                });

              return updatedKeyword;
            }

            // Contact search broker ID
            if (keyword.name === 'contactSearchBrokerId') {

              updatedKeyword.translation = 'keyword_broker_for_contact_search';
              updatedKeyword.isRemovable = true;

              formOptions.brokerId
                .some(optionGroup => {

                  const label = optionGroup.options.find(option => option.value === keyword.value);

                  if (label) {

                    updatedKeyword.label = label.text;
                  }

                  return !!label;
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
  protected selectDefaultFilters(): Observable<MatchingGroupSearchModel> {

    return this.store$.select(createSelector(
      selectDataOptions,
      (
        options: RuntimeOptionsInterface,
      ): MatchingGroupSearchModel => {

        const filters = this.getEmptyFilters();

        filters.matchingGroupEntity = options.matchingGroupEntity[0].value;
        filters.matchingGroupType = options.matchingGroupType[0].value;

        return filters;
      },
    ));
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultSort(): Observable<SortInterface> {

    return of({
      id: 'id',
      order: OrderEnum.desc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<MatchingGroupModel> {

    return selectDataMatchingGroups;
  }
}
