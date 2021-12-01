import { Component, Input } from '@angular/core';

import { SidenavComponentAbstract } from '../sidenav/sidenav-component.abstract';
import { ContactModel } from '../../shared/model/contact.model';
import { PropertyModel } from '../../shared/model/property.model';
import { PromotionModel } from '../../shared/model/promotion.model';
import { HeaderSearchInterface } from '../../shared/interface/header-search.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { HeaderSearchResultInterface } from '../../shared/interface/header-search-result.interface';
import { BrowserService } from '../../core/shared/browser/browser.service';

@Component({
  selector: 'app-layout-sidenav-search',
  templateUrl: './sidenav-search.component.html',
  styleUrls: ['./sidenav-search.component.scss'],
})
export class SidenavSearchComponent extends SidenavComponentAbstract {

  /**
   * Permissions
   */
  @Input() permissions: PermissionEnum[] = [];

  /**
   * Search
   */
  @Input() search: HeaderSearchInterface;

  /**
   * Search results
   */
  @Input() results: HeaderSearchResultInterface;

  /**
   * Constants
   */
  readonly PERMISSION_CONTACT_READ: PermissionEnum = PermissionEnum.contactRead;
  readonly PERMISSION_PROPERTY_READ: PermissionEnum = PermissionEnum.propertyRead;
  readonly PERMISSION_PROMOTION_READ: PermissionEnum = PermissionEnum.promotionRead;

  /**
   * Placeholder count
   */
  readonly placeholderCount: number = 3;

  /**
   * Constructor
   */
  constructor(
    private browserService: BrowserService,
  ) {

    super();
  }

  /**
   * Clicked on a contact card
   */
  onClickContact(model: ContactModel): void {

    this.browserService.redirect('/contact/active/contact?contact_id=' + model.id);
  }

  /**
   * Clicked on a property card
   */
  onClickProperty(model: PropertyModel): void {

    this.browserService.redirect('/property/index/active/{type}?property_id='.replace('{type}', model.type) + model.id);
  }

  /**
   * Clicked on a promotion card
   */
  onClickPromotion(model: PromotionModel): void {

    this.browserService.redirect('/promotion/active?promotion_id=' + model.id);
  }
}
