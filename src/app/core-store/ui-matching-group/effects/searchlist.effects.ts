import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { combineLatest, concat, Observable, of, zip } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { SearchlistEventSubmit } from '../../ui-searchlist/actions/searchlist-event-submit';
import { RuntimeUpdateContextual } from '../../ui-runtime/actions/runtime-update-contextual';
import { MatchingGroupUpdateActionMenu } from '../actions/matching-group-update-action-menu';
import { MatchingGroupEventAction } from '../actions/matching-group-event-action';
import { MatchingGroupModel } from '../../../shared/model/matching-group.model';
import { MatchingActionEnum } from '../../../shared/enum/matching-action.enum';
import { SearchlistEventChangeSelectionIds } from '../../ui-searchlist/actions/searchlist-event-change-selection-ids';
import { MatchingGroupEventProcess } from '../actions/matching-group-event-process';
import { SearchlistEventOperation } from '../../ui-searchlist/actions/searchlist-event-operation';
import { MatchingGroupEventPrepare } from '../actions/matching-group-event-prepare';
import { EntityEventOperation } from '../../ui-entity/actions/entity-event-operation';
import { MatchingGroupUpdateActionSelection } from '../actions/matching-group-update-action-selection';
import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { MatchingGroupEventChangeInputProposal } from '../actions/matching-group-event-change-input-proposal';
import { MatchingGroupUpdateProposal } from '../actions/matching-group-update-proposal';
import { EmailApiService } from '../../../api/shared/email/email-api.service';
import { EmailUpsertEmailContent } from '../../data-email/actions/email-upsert-email-content';
import { MatchingModel } from '../../../shared/model/matching.model';
import { MatchingApiService } from '../../../api/shared/matching/matching-api.service';
import { MatchingGroupEventToggle } from '../actions/matching-group-event-toggle';
import { MatchingGroupUpdateToggle } from '../actions/matching-group-update-toggle';
import { MatchingGroupUpsert } from '../../data-matching-group/actions/matching-group-upsert';
import { MatchingGroupSearchlistService } from '../../../core/shared/matching-group/matching-group-searchlist.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { MatchingGroupConfig } from '../../../core/shared/matching-group/matching-group.config';
import { MatchingGroupSearchModel } from '../../../shared/model/matching-group-search.model';
import { MatchingGroupSearchOptionsInterface } from '../../../shared/interface/matching-group-search-options.interface';
import { MatchingGroupService } from '../../../core/shared/matching-group/matching-group.service';
import { EmailSearchlistService } from '../../../core/shared/email/email-searchlist.service';
import { EmailEventListSender } from '../../ui-email/actions/email-event-list-sender';
import { Dictionary } from '../../../shared/class/dictionary';
import { RuntimeEventNotification } from '../../ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { BrowserService } from '../../../core/shared/browser/browser.service';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  MatchingGroupModel,
  MatchingGroupSearchModel,
  MatchingGroupSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: MatchingGroupService,
    protected searchlistService: MatchingGroupSearchlistService,
    private moduleConfig: MatchingGroupConfig,
    private emailApiService: EmailApiService,
    private matchingApiService: MatchingApiService,
    private emailSearchlistService: EmailSearchlistService,
    private browserService: BrowserService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * Empty list of action selections and reset toggle state when submitting searchlist
   *
   * @action SearchlistEventSubmit
   */
  SearchlistEventSubmit2$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventSubmit>(SearchlistEventSubmit.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => [

      new MatchingGroupUpdateActionSelection({
        actionSelection: {},
      }),

      new MatchingGroupUpdateToggle({
        toggle: {},
      }),
    ]),
  ));

  /**
   * Empty action select after updated selection IDs to empty list
   *
   * @action SearchlistUpdateSelectionIds
   */
  SearchlistUpdateSelectionIds$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventChangeSelectionIds>(SearchlistEventChangeSelectionIds.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => {

      const actions = [];

      if (action.payload.ids.length === 0) {

        // Update action selection
        actions.push(
          new MatchingGroupUpdateActionSelection({
            actionSelection: {},
          }),
        );
      }

      return actions;
    }),
  ));

  /**
   * Display action menu when requesting it
   *
   * @action MatchingGroupUpdateActionMenu
   */
  MatchingGroupUpdateActionMenu$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<MatchingGroupUpdateActionMenu>(MatchingGroupUpdateActionMenu.TYPE),
    map(action => new RuntimeUpdateContextual({
      contextual: {
        uid: 'matching-group-action-menu',
        position: action.payload.actionMenu.position,
      },
    })),
  ));

  /**
   * Update action selection when providing single action
   *
   * @action MatchingGroupEventAction
   */
  MatchingGroupEventAction$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<MatchingGroupEventAction>(MatchingGroupEventAction.TYPE),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectActionSelection(),
      this.searchlistService.selectModels(action.payload.uid),
    )),
    switchMap(([action, actionSelection, matchingGroups]) => {

      const actionSelectionState = {
        ...actionSelection,
      };

      // Updating "all"
      if (action.payload.action.matchingGroupId === null && action.payload.action.matchingId === null) {

        matchingGroups.forEach(matchingGroup => {

          const model = <MatchingGroupModel>matchingGroup;

          // Prevent setting "send" action on matching group that has no valid email
          if (
            action.payload.action.actionId === MatchingActionEnum.send &&
            model.contact !== null &&
            model.contact.isValidEmail === false
          ) {

            return;
          }

          actionSelectionState[model.id] = action.payload.action;

          model.matchings.forEach(matching => {

            // Prevent setting "send" action on matching that has no valid email
            if (
              action.payload.action.actionId === MatchingActionEnum.send &&
              matching.contact !== null &&
              matching.contact.isValidEmail === false
            ) {

              return;
            }

            actionSelectionState[matching.id] = {
              ...action.payload.action,
              matchingGroupId: matchingGroup.id,
              matchingId: matching.id,
              contactId: matching.contact && matching.contact.id,
            };
          });
        });

      // Updating matching group and all its matchings
      } else if (action.payload.action.matchingGroupId !== null && action.payload.action.matchingId === null) {

        const model = matchingGroups.find(matchingGroup => matchingGroup.id === action.payload.action.matchingGroupId);
        if (!!model) {

          actionSelectionState[model.id] = action.payload.action;

          (<MatchingGroupModel>model).matchings.forEach(matching => {

            // Prevent setting "send" action on matching that has no valid email
            if (
              action.payload.action.actionId === MatchingActionEnum.send &&
              matching.contact !== null &&
              matching.contact.isValidEmail === false
            ) {

              return;
            }

            actionSelectionState[matching.id] = {
              ...action.payload.action,
              matchingId: matching.id,
              contactId: matching.contact && matching.contact.id,
            };
          });
        }

      // Updating single matching
      } else if (action.payload.action.matchingGroupId !== null && action.payload.action.matchingId !== null) {

        actionSelectionState[action.payload.action.matchingId] = action.payload.action;
      }

      // Pick IDs that do not have action "wait"
      const ids = Object
        .keys(actionSelectionState)
        .filter(id => actionSelectionState[id].actionId !== MatchingActionEnum.wait);

      return [

        // Update action selection
        new MatchingGroupUpdateActionSelection({
          actionSelection: actionSelectionState,
        }),

        // Update models selection
        new SearchlistEventChangeSelectionIds({
          uid: action.payload.uid,
          ids: ids,
        }),
      ];
    }),
  ));

  /**
   * Open modal "send proposal" or "confirmation" depending on selected actions when preparing
   *
   * @action MatchingGroupEventPrepare
   */
  MatchingGroupEventPrepare$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<MatchingGroupEventPrepare>(MatchingGroupEventPrepare.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectAuthentication(),
      this.searchlistService.selectActionSelection(),
      this.runtimeService.selectFeatureMatching(),
      this.searchlistService.selectMatchingGroupType(action.payload.uid),
    )),
    switchMap(([action, authentication, actionSelection, featureMatching, matchingGroupType]) => {

      // At least one action is "send"
      const hasSendAction = Object
        .keys(actionSelection)
        .some(id => actionSelection[id].actionId === MatchingActionEnum.send);

      const actions: Action[] = [

        // Launch operation
        new SearchlistEventOperation({
          uid: action.payload.uid,
          operation: hasSendAction ? 'matching-group-proposal' : 'matching-group-confirm',
          ids: [],
        }),
      ];

      if (hasSendAction === true) {

        // Load senders list
        actions.push(new EmailEventListSender({}));

        // Update proposal to default values
        actions.push(
          new MatchingGroupUpdateProposal({
            proposal: {
              senderId: authentication.contactId,
              emailTemplateId: featureMatching.emailTemplate[matchingGroupType] || '',
              emailContentId: featureMatching.emailContent[matchingGroupType] || '',
              emailBrochureTypeId: featureMatching.emailBrochureType[matchingGroupType] || '',
              emailBrochurePrivacyId: featureMatching.emailBrochurePrivacy[matchingGroupType] || '',
              emailContentLanguageId: {},
              emailContentLanguageHtml: {},
            },
          }),
        );
      }

      return actions;
    }),
  ));

  /**
   * Process selected actions
   *
   * @action MatchingGroupEventProcess
   */
  MatchingGroupEventProcess$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<MatchingGroupEventProcess>(MatchingGroupEventProcess.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectActionSelection(),
      this.searchlistService.selectProposal(),
      this.searchlistService.selectDataMatchingGroup(),
      this.emailSearchlistService.selectDataEmailContents(),
      this.searchlistService.selectFilters(action.payload.uid),
    )),
    map(([action, actionSelection, proposal, matchingGroups, emailContents, filters]) => {

      const matchings: Dictionary<MatchingModel> = {};
      Object
        .keys(matchingGroups)
        .forEach(id => {

          matchingGroups[id].matchings.forEach(matching => matchings[matching.id] = matching);
        });

      const actionCalls: Dictionary<{
        matchings: MatchingModel[],
        actionId: MatchingActionEnum,
        brokerId: string|null,
        methodId: string|null,
      }> = {};

      const d = new Date();
      const day = d.getDate();
      const month = d.getMonth() + 1;
      const date = [
        day < 10 ? '0' + day : day,
        month < 10 ? '0' + month : month,
        d.getFullYear(),
      ].join('/');

      const ids: string[] = [];

      // For each selected action
      Object
        .keys(actionSelection)
        .forEach(id => {

          // No matching ID or no selected matching
          if (actionSelection[id].matchingId === null || !matchings[actionSelection[id].matchingId]) {

            return;
          }

          // Generate unique action call identifier
          const uniqueId = [
            actionSelection[id].actionId,
            actionSelection[id].brokerId || '',
            actionSelection[id].methodId || '',
          ].join('-');

          if (!actionCalls[uniqueId]) {

            actionCalls[uniqueId] = {
              matchings: [],
              actionId: actionSelection[id].actionId,
              brokerId: actionSelection[id].brokerId,
              methodId: actionSelection[id].methodId,
            };
          }

          // Add matching to list of matching by action
          actionCalls[uniqueId].matchings.push(matchings[actionSelection[id].matchingId]);
          ids.push(actionSelection[id].matchingId);
        });

      const apiCalls: Array<() => Observable<object|boolean>> = [];

      Object
        .keys(actionCalls)
        .forEach(uniqueId => {

          // Refuse action
          if (actionCalls[uniqueId].actionId === MatchingActionEnum.refuse) {

            apiCalls.push(
              () => this.matchingApiService.refuse(actionCalls[uniqueId].matchings, true, ''),
            );
          }

          // Delay action
          if (actionCalls[uniqueId].actionId === MatchingActionEnum.delay) {

            apiCalls.push(
              () => this.matchingApiService.refuse(actionCalls[uniqueId].matchings, false, ''),
            );
          }

          // Send action
          if (actionCalls[uniqueId].actionId === MatchingActionEnum.send) {

            apiCalls.push(
              () => this.matchingApiService.send(
                actionCalls[uniqueId].matchings,
                proposal,
                emailContents[proposal.emailContentId],
                filters.matchingGroupEntity === 'by-promotion',
              ),
            );
          }

          // Transfer action
          if (actionCalls[uniqueId].actionId === MatchingActionEnum.transfer) {

            apiCalls.push(
              () => this.matchingApiService.transfer(actionCalls[uniqueId].matchings, actionCalls[uniqueId].brokerId),
            );
          }

          // Process action
          if (actionCalls[uniqueId].actionId === MatchingActionEnum.process) {

            apiCalls.push(
              () => this.matchingApiService.process(
                actionCalls[uniqueId].matchings,
                actionCalls[uniqueId].methodId,
                date,
                '',
              ),
            );
          }
        });

      return new EntityEventOperation({
        entity: this.moduleConfig.ENTITY,
        ids: ids,
        message: 'notification_matching_update',
        operation: 'process',
        apiCall: () => {

          // Combine all API calls into a single observable
          return combineLatest(
            apiCalls.map(apiCall => apiCall()),
          );
        },
      });
    }),
  ));

  /**
   * Updates proposal state when form input has been updated
   *
   * @action MatchingGroupEventChangeInputProposal
   */
  MatchingGroupEventChangeInputProposal$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<MatchingGroupEventChangeInputProposal>(MatchingGroupEventChangeInputProposal.TYPE),
    mergeMap(action => zip(
      of(action),
      this.searchlistService.selectProposal(),
    )),
    mergeMap(([action, proposal]) => {

      const newProposal = {
        ...proposal,
      };

      // Update with payload's input
      newProposal[action.payload.input.name] = action.payload.input.value;

      // Email content updated
      if (action.payload.input.name === 'emailContentId' && action.payload.input.value) {

        // API call
        return this
          .emailApiService
          .emailContent(<string>action.payload.input.value)
          .pipe(

            // Success
            switchMap(emailContent => {

              // Update content per language
              newProposal.emailContentLanguageHtml = {
                id: emailContent.id,
                ...emailContent.html,
              };

              return [

                // Upsert email content
                new EmailUpsertEmailContent({ models: [emailContent] }),

                // Update proposal
                new MatchingGroupUpdateProposal({
                  proposal: newProposal,
                }),
              ];
            }),

            // Error
            catchError(error => [

              // Broadcast error
              new RuntimeEventError({ id: '4', error: error }),
            ]),
          );
      }

      // Update proposal
      return of(new MatchingGroupUpdateProposal({
        proposal: newProposal,
      }));
    }),
  ));

  /**
   * Update proposal based on available options that depend on the proposal state
   *
   * @action MatchingGroupUpdateProposal
   */
  MatchingGroupUpdateProposal$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<MatchingGroupUpdateProposal>(MatchingGroupUpdateProposal.TYPE),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectProposalOptions(),
    )),
    switchMap(([action, proposalOptions]) => {

      const actions = [];

      // Selected privacy value is not part of privacy options anymore
      if (
        proposalOptions.emailBrochurePrivacyId.length > 0 &&
        !proposalOptions.emailBrochurePrivacyId.find(option => option.value === action.payload.proposal.emailBrochurePrivacyId)
      ) {

        // Update proposal
        actions.push(new MatchingGroupUpdateProposal({
          proposal: {
            ...action.payload.proposal,
            emailBrochurePrivacyId: proposalOptions.emailBrochurePrivacyId[0].value,
          },
        }));
      }

      return actions;
    }),
  ));

  /**
   * Update toggle state on toggle action
   *
   * @action MatchingGroupEventToggle
   */
  MatchingGroupEventToggle$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<MatchingGroupEventToggle>(MatchingGroupEventToggle.TYPE),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectToggle(),
      this.searchlistService.selectDataMatchingGroup(),
      this.searchlistService.selectFilters(this.searchlistService.getUid(this.browserService.getWindow().location.pathname)),
    )),
    switchMap(([action, toggle, matchingGroups, filters]) => {

      const newToggle = {
        ...toggle,
      };

      newToggle[action.payload.matchingGroupId] = action.payload.isUnfold;

      const observables: Observable<Action>[] = [
        of(
          new MatchingGroupUpdateToggle({
            toggle: newToggle,
          }),
        ),
      ];

      const matchingGroup = matchingGroups[action.payload.matchingGroupId];

      // Unfolded matching group is property or promotion
      if (action.payload.isUnfold === true && matchingGroup && (matchingGroup.property || matchingGroup.promotion)) {

        // Filter on property or promotion
        const toggleFilters = new MatchingGroupSearchModel();
        toggleFilters.matchingGroupEntity = filters.matchingGroupEntity;
        toggleFilters.matchingGroupType = filters.matchingGroupType;

        if (matchingGroup.property) {

          toggleFilters.propertyId = matchingGroup.property.id;
        }

        if (matchingGroup.promotion) {

          toggleFilters.promotionId = matchingGroup.promotion.id;
        }

        // API call
        observables.push(
          this
            .modelService
            .list(
              { page: 1, perPage: 1 },
              { id: 'id', order: OrderEnum.desc },
              toggleFilters,
            )
            .pipe(

              // Success
              switchMap(list => [

                // Upsert data models
                this.getUpsertAction(list.models),

              ]),

              // Error
              catchError(error => [

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.failure,
                  message: 'notification_search_failure',
                }),

                // Broadcast error
                new RuntimeEventError({ id: '14', error: error }),

              ]),
            ),
        );
      }

      return concat(...observables);
    }),
  ));

  /**
   * @inheritDoc
   */
  protected getUpsertAction(models: MatchingGroupModel[]): MatchingGroupUpsert {

    return new MatchingGroupUpsert({
      models: models,
    });
  }
}
