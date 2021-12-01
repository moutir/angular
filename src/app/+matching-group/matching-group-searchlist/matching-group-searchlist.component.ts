import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { MatchingGroupModel } from '../../shared/model/matching-group.model';
import { MatchingGroupSearchOptionsInterface } from '../../shared/interface/matching-group-search-options.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { MatchingGroupSearchlistService } from '../../core/shared/matching-group/matching-group-searchlist.service';
import { MatchingGroupSearchModel } from '../../shared/model/matching-group-search.model';
import { MatchingGroupProposalInterface } from '../../shared/interface/matching-group-proposal.interface';
import { MatchingGroupProposalOptionsInterface } from '../../shared/interface/matching-group-proposal-options.interface';
import { MatchingGroupActionMenuInterface } from '../../shared/interface/matching-group-action-menu.interface';
import { MenuInterface } from '../../shared/interface/menu.interface';
import { MenuItemInterface } from '../../shared/interface/menu-item.interface';
import { MatchingActionEnum } from '../../shared/enum/matching-action.enum';
import { MatchingGroupActionLabelInterface } from '../../shared/interface/matching-group-action-label.interface';
import { InputFormInterface } from '../../shared/interface/input-form.interface';
import { ModalChoiceInterface } from '../../shared/interface/modal-choice.interface';
import { PositionInterface } from '../../shared/interface/position.interface';
import { MatchingGroupActionSelectionInterface } from '../../shared/interface/matching-group-action-selection.interface';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { MatchingGroupConfig } from '../../core/shared/matching-group/matching-group.config';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { Dictionary } from '../../shared/class/dictionary';

@Component({
  selector: 'app-matching-group-searchlist',
  templateUrl: './matching-group-searchlist.component.html',
  styleUrls: ['./matching-group-searchlist.component.scss'],
})
export class MatchingGroupSearchlistComponent extends SearchlistComponentAbstract<
  MatchingGroupModel,
  MatchingGroupSearchModel,
  MatchingGroupSearchOptionsInterface
> {

  /**
   * Searchlist entity
   */
  @Input() entity: EntityEnum = EntityEnum.property;

  /**
   * Matching group entity
   */
  @Input() matchingGroupEntity: string = '';

  /**
   * State observables
   */
  runtimeFeature$: Observable<RuntimeFeatureInterface>;
  runtimePermissions$: Observable<PermissionEnum[]>;
  proposal$: Observable<MatchingGroupProposalInterface>;
  proposalOptions$: Observable<MatchingGroupProposalOptionsInterface>;
  actionMenuItems$: Observable<MenuInterface>;
  actionLabel$: Observable<Dictionary<MatchingGroupActionLabelInterface>>;
  actionSelection$: Observable<Dictionary<MatchingGroupActionSelectionInterface>>;
  toggle$: Observable<Dictionary<boolean>>;

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: MatchingGroupConfig,
    protected searchlistService: MatchingGroupSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
  ) {

    super(moduleConfig, searchlistService, runtimeService, router);
  }

  /**
   * Track by model ID
   */
  trackById(index: number, model: MatchingGroupModel): string {

    return model.id;
  }

  /**
   * Clicked the page action button
   */
  onClickActionPage(event: MouseEvent): void {

    this.searchlistService.openActionMenu({
      position: {
        x: event.clientX,
        y: event.clientY,
      },
      matchingGroup: null,
      matching: null,
    });
  }

  /**
   * Clicked a row action button
   */
  onClickActionRow(actionMenu: MatchingGroupActionMenuInterface): void {

    this.searchlistService.openActionMenu(actionMenu);
  }

  /**
   * Changed input proposal
   */
  onChangeInputProposal(input: InputFormInterface): void {

    this.searchlistService.updateProposalInput(input);
  }

  /**
   * Submitted modal proposal
   */
  onSubmitModalProposal(event: ModalChoiceInterface<MatchingGroupProposalInterface>): void {

    // User cancelled
    if (event.isValid === false) {

      // Reset current operation
      this.resetOperation();

      return;
    }

    this.searchlistService.operation(this.uid, 'matching-group-confirm');
  }

  /**
   * Submitted modal confirm
   */
  onSubmitModalConfirm(event: ModalChoiceInterface<void>): void {

    // Reset current operation
    this.resetOperation();

    // User cancelled
    if (event.isValid === false) {

      return;
    }

    this.searchlistService.process(this.uid);
  }

  /**
   * Clicked an action menu item
   */
  onClickMenuItemAction(menuItem: MenuItemInterface): void {

    // TODO[later] Improve: Extract data from the menu item ID (not awesome, but preferred over using `menuItem.data: any`)
    const action: MatchingGroupActionSelectionInterface = JSON.parse(menuItem.id);

    // Missing data
    if (
      action.actionId === MatchingActionEnum.transfer && action.brokerId === null ||
      action.actionId === MatchingActionEnum.process && action.methodId === null
    ) {

      return;
    }

    this.searchlistService.action(this.uid, action);
  }

  /**
   * @inheritDoc
   */
  onClickSelectAction(position: PositionInterface): void {

    this.searchlistService.prepare(this.uid);
  }

  /**
   * Clicked toggle button
   */
  onClickToggle(isUnfold: boolean, matchingGroup: MatchingGroupModel): void {

    this.searchlistService.toggle(matchingGroup.id, isUnfold);
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    // Set state observables
    this.runtimeFeature$ = this.runtimeService.selectFeature();
    this.runtimePermissions$ = this.runtimeService.selectPermissions();
    this.actionMenuItems$ = this.searchlistService.selectActionMenuItems();
    this.actionLabel$ = this.searchlistService.selectActionLabel();
    this.actionSelection$ = this.searchlistService.selectActionSelection();
    this.proposal$ = this.searchlistService.selectProposal();
    this.proposalOptions$ = this.searchlistService.selectProposalOptions();
    this.toggle$ = this.searchlistService.selectToggle();
  }
}
