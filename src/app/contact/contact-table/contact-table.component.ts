import { Component, EventEmitter, Input, Output } from '@angular/core';

import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { ContactModel } from '../../shared/model/contact.model';
import { SearchModel } from '../../shared/model/search.model';
import { ContactSearchModel } from '../../shared/model/contact-search.model';

@Component({
  selector: 'app-contact-table',
  templateUrl: './contact-table.component.html',
  styleUrls: ['./contact-table.component.scss'],
})
export class ContactTableComponent extends TableComponentAbstract<ContactModel> {

  /**
   * Is user subscribed to beta performance
   */
  @Input() isBetaPerformance: boolean|null = null;

  /**
   * Feature
   */
  @Input() feature: RuntimeFeatureInterface;

  /**
   * Permissions
   */
  @Input() permissions: PermissionEnum[] = [];

  /**
   * Filters
   */
  @Input() filters: ContactSearchModel|null = null;

  /**
   * Clicked a search model
   */
  @Output() clickSearchModel: EventEmitter<{
    contact: ContactModel;
    search: SearchModel;
  }> = new EventEmitter<{
    contact: ContactModel;
    search: SearchModel;
  }>();

  /**
   * @inheritDoc
   */
  onClickModel(model: ContactModel): void {

    // Blacklisted contact or confidential contact
    if (model.isBlacklisted || model.isConfidential) {

      return;
    }

    super.onClickModel(model);
  }

  /**
   * Clicked a contact search
   */
  onClickContactSearch(contact: ContactModel, search: SearchModel|null): void {

    // Blacklisted contact or confidential contact
    if (contact.isBlacklisted || contact.isConfidential) {

      return;
    }

    this.clickSearchModel.emit({ contact, search });
  }
}
