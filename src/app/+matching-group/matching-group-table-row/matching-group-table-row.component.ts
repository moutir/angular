import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MatchingGroupModel } from '../../shared/model/matching-group.model';
import { MatchingModel } from '../../shared/model/matching.model';
import { MatchingGroupActionMenuInterface } from '../../shared/interface/matching-group-action-menu.interface';
import { MatchingGroupActionLabelInterface } from '../../shared/interface/matching-group-action-label.interface';
import { PropertyModel } from '../../shared/model/property.model';
import { ContactModel } from '../../shared/model/contact.model';
import { PromotionModel } from '../../shared/model/promotion.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { PropertyService } from '../../core/shared/property/property.service';
import { ModelAbstract } from '../../shared/class/model.abstract';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { MatchingScoreInterface } from '../../shared/interface/matching-score.interface';
import { Dictionary } from '../../shared/class/dictionary';

@Component({
  selector: 'app-matching-group-table-row',
  templateUrl: './matching-group-table-row.component.html',
  styleUrls: ['./matching-group-table-row.component.scss'],
})
export class MatchingGroupTableRowComponent extends TableRowComponentAbstract implements OnChanges {

  /**
   * List of enabled/disabled features
   */
  @Input() feature: RuntimeFeatureInterface;

  /**
   * Matching group to display
   */
  @Input() matchingGroup: MatchingGroupModel = new MatchingGroupModel();

  /**
   * Is the row unfolded ?
   */
  @Input() isUnfold: boolean = false;

  /**
   * Action label
   */
  @Input() actionLabel: Dictionary<MatchingGroupActionLabelInterface> = {};

  /**
   * Matching group entity
   */
  @Input() matchingGroupEntity: string = '';

  /**
   * Clicked the action button
   */
  @Output() clickAction: EventEmitter<MatchingGroupActionMenuInterface> = new EventEmitter<MatchingGroupActionMenuInterface>();

  /**
   * Clicked the toggle button
   */
  @Output() clickToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * CSS height of property/contact row (without first child's extra padding-top)
   */
  matchingRowHeight: Dictionary<number> = {
    property: 70,
    contact: 70,
  };

  /**
   * CSS padding-top for the matching list's first child
   */
  matchingRowPaddingTop: number = 2;

  /**
   * CSS height of the matching list
   */
  matchingListHeight: number = 0;

  /**
   * Minimum number of matchings to display in list
   */
  matchingCountMin: number = 3;

  /**
   * Has the row been unfolded once ?
   */
  isUnfoldOnce: boolean = false;

  /**
   * Matching score status
   */
  matchingScoreStatus: string = '';

  /**
   * Constructor
   */
  constructor(
    private propertyService: PropertyService,
    private translateService: TranslateService,
  ) {

    super();
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (this.isPlaceholder === true && this.matchingGroupEntity) {

      this.matchingGroup = new MatchingGroupModel();

      const matching = new MatchingModel();
      matching.contact = new ContactModel();
      matching.property = new PropertyModel();

      switch (this.matchingGroupEntity) {

        case 'by-contact':
          this.matchingGroup.contact = new ContactModel();
          break;

        case 'by-property':
          this.matchingGroup.property = new PropertyModel();
          break;

        case 'by-promotion':
          this.matchingGroup.promotion = new PromotionModel();
          break;
      }

      // Generate a list of empty matchings
      this.matchingGroup.matchings = [];

      for (let i = 0; i < this.matchingCountMin; i++) {

        this.matchingGroup.matchings.push(matching);
      }
    }

    // Define matching list height
    const height = this.matchingGroup.contact !== null ? this.matchingRowHeight.property : this.matchingRowHeight.contact;
    let count = this.matchingGroup.matchings.length;

    if (this.isPlaceholder === true) {

      count = this.matchingCountMin;

    } else if (this.isUnfold === false) {

      count = this.matchingGroup.matchings.length <= this.matchingCountMin ? this.matchingGroup.matchings.length : this.matchingCountMin;
    }

    this.matchingListHeight = this.matchingRowPaddingTop + height * count;

    // Unfolded
    if (this.isUnfold === true) {

      this.isUnfoldOnce = true;
    }
  }

  /**
   * Track by model ID
   */
  trackById(index: number, model: MatchingModel): string {

    return model.id;
  }

  /**
   * Clicked action button
   */
  onClickButtonAction(event: MouseEvent, matchingGroup: MatchingGroupModel|null, matching: MatchingModel|null): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder
    if (this.isPlaceholder) {

      return;
    }

    // Emit event
    this.clickAction.emit({
      position: {
        x: event.clientX,
        y: event.clientY,
      },
      matchingGroup: matchingGroup,
      matching: matching,
    });
  }

  /**
   * Clicked toggle button
   */
  onClickToggle(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder
    if (this.isPlaceholder) {

      return;
    }

    this.clickToggle.emit(!this.isUnfold);
  }

  /**
   * Clicked a property keyword
   */
  onClickPropertyKeyword(event: MouseEvent, property: PropertyModel): void {

    this.propertyService.preview(property.id, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  /**
   * Returns the matching score tooltip
   */
  getMatchingScoreTooltip(score: MatchingScoreInterface): string {

    let tooltip = this.translateService.instant('label_matching_breakdown') + '\n';

    tooltip += [
      (score.price + '% ' + this.translateService.instant('label_price')),
      (score.area + '% ' + this.translateService.instant('label_area')),
      (score.land + '% ' + this.translateService.instant('label_land')),
      (score.bedroom + '% ' + this.translateService.instant('label_rooms')),
      (score.room + '% ' + this.translateService.instant('label_specific_rooms')),
      ('50% ' + this.translateService.instant('label_other_criterias')),
    ].join('\n')
    .toLowerCase();

    return tooltip;
  }

  /**
   * Returns the matching score status
   */
  getMatchingScoreStatus(score: number): string {

    if (score < 50) {

      return '';
    }

    if (score === 100) {

      return 'high';
    }

    if (score >= 75 && score <= 99) {

      return 'medium';
    }

    if (score >= 50 && score <= 74) {

      return 'low';
    }
  }

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.matchingGroup;
  }
}
