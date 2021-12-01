import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { PropertyModel } from '../../shared/model/property.model';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { PropertyService } from '../../core/shared/property/property.service';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { ModelAbstract } from '../../shared/class/model.abstract';
import { RuntimeFeaturePriceInterface } from '../../shared/interface/runtime-feature-price.interface';
import { TypeEnum } from '../../shared/enum/type.enum';
import { HistoryService } from '../../core/shared/history/history.service';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { TrackingActionEnum } from '../../shared/enum/tracking-action.enum';
import { TrackerService } from '../../core/shared/tracker/tracker.service';
import { ContactLinkLayoutType } from '../../shared/type/contact-link-layout.type';

@Component({
  selector: 'app-property-table-row',
  templateUrl: './property-table-row.component.html',
  styleUrls: ['./property-table-row.component.scss'],
})
export class PropertyTableRowComponent extends TableRowComponentAbstract implements OnChanges {

  /**
   * Property to display
   */
  @Input() property: PropertyModel = new PropertyModel();

  /**
   * List of enabled/disabled features
   */
  @Input() feature: RuntimeFeatureInterface;

  /**
   * Price feature
   */
  @Input() featurePrice: RuntimeFeaturePriceInterface;

  /**
   *  List of permissions granted
   */
  @Input() permissions: PermissionEnum[];

  /**
   * Constants
   */
  readonly TYPE_SELL: TypeEnum = TypeEnum.sell;
  readonly TYPE_RENT: TypeEnum = TypeEnum.rent;

  /**
   * Maximum number of contacts
   */
  contactMax: number = 4;

  /**
   * List of contacts (broker + owners + intermediaries)
   */
  contacts: Array<{
    id: string;
    initials: string;
    type: ContactLinkLayoutType;
    hasWarning: boolean;
  }> = [];

  /**
   * Constructor
   */
  constructor(
    private propertyService: PropertyService,
    private runtimeService: RuntimeService,
    private historyService: HistoryService,
    private trackerService: TrackerService,

  ) {

    super();
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.property) {

      this.contacts = [];

      // Has broker initials
      if (this.property.broker.initials) {

        this.contacts.push({
          id: this.property.broker.id,
          initials: this.property.broker.initials,
          type: 'broker',
          hasWarning: this.property.isMls === true,
        });
      }

      // Owners
      this.property.owners.forEach(owner => {

        this.contacts.push({
          id: owner.id,
          initials: owner.initials,
          type: 'owner',
          hasWarning: false,
        });
      });

      // Intermediates
      this.property.intermediates.forEach(intermediate => {

        this.contacts.push({
          id: intermediate.id,
          initials: intermediate.initials,
          type: 'intermediary',
          hasWarning: false,
        });
      });
    }
  }

  /**
   * Clicked mortgage button
   */
  onClickButtonMortgage(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    this.propertyService.mortgage({
      step: 1,
      propertyId: this.property.id,
      contactId: '',
      query: '',
    });
  }

  /**
   * Clicked rank button
   */
  onClickButtonRank(event: MouseEvent, ranking: number): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder or an unshared property or a MLS property or a blocked actions
    if (this.isPlaceholder || this.property.isSharedRestricted || this.property.isMls || this.isUsingActions === false) {

      return;
    }

    this.propertyService.changeRanking(this.property, ranking);
  }

  /**
   * Clicked matching agency button
   */
  onClickButtonMatchingAgency(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder
    if (this.isPlaceholder) {

      return;
    }

    this.propertyService.matchingAgency(this.property);
  }

  /**
   * Clicked matching MLS button
   */
  onClickButtonMatchingMls(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder
    if (this.isPlaceholder) {

      return;
    }

    this.propertyService.matchingMls(this.property);
  }

  /**
   * Clicked brochure button
   */
  onClickButtonBrochure(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder or an unshared property
    if (this.isPlaceholder || this.property.isSharedRestricted) {

      return;
    }

    this.propertyService.openBrochureMenu(this.property.id, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  /**
   * Clicked on thumbnail
   */
  onClickThumbnail(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder
    if (this.isPlaceholder) {

      return;
    }

    this.runtimeService.previewImage(this.property.photoLargeURL, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  /**
   * Clicked history button
   */
  onClickButtonHistory(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder or an unshared property
    if (this.isPlaceholder || this.property.isSharedRestricted) {

      return;
    }

    // New history enabled
    if (this.feature.history === true) {

      this.historyService.openModal(EntityEnum.property, this.property.id, this.property.reference);

      // Stats
      this.trackerService.trackString(TrackingActionEnum.propertyRowHistory, this.property.reference);
    }
  }

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.property;
  }
}
