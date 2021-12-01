import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CustomAttributeModel } from '../../shared/model/custom-attribute.model';
import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { CustomAttributePageService } from '../../core/shared/custom-attribute/custom-attribute-page.service';
import { CustomAttributeOptionsInterface } from '../../shared/interface/custom-attribute-options.interface';
import { PropertySearchlistService } from '../../core/shared/property/property-searchlist.service';
import { PromotionSearchlistService } from '../../core/shared/promotion/promotion-searchlist.service';
import { ContactSearchlistService } from '../../core/shared/contact/contact-searchlist.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { ListTypeEnum } from '../../shared/enum/list-type.enum';

@Component({
  selector: 'app-custom-attribute-page-read',
  templateUrl: './custom-attribute-page-read.component.html',
  styleUrls: ['./custom-attribute-page-read.component.scss'],
})
export class CustomAttributePageReadComponent extends PageReadComponentAbstract<CustomAttributeModel, CustomAttributeOptionsInterface> {

  /**
   * Constants
   */
  readonly PAGE_TAB_INFORMATION: PageTabEnum = PageTabEnum.customAttributeReadInformation;
  readonly PAGE_TAB_PROPERTY_SALE: PageTabEnum = PageTabEnum.customAttributeReadPropertySale;
  readonly PAGE_TAB_PROPERTY_RENT: PageTabEnum = PageTabEnum.customAttributeReadPropertyRent;
  readonly PAGE_TAB_PROMOTION: PageTabEnum = PageTabEnum.customAttributeReadPromotion;
  readonly PAGE_TAB_CONTACT: PageTabEnum = PageTabEnum.customAttributeReadContact;
  readonly LIST_TYPE_SELL: ListTypeEnum = ListTypeEnum.sell;
  readonly LIST_TYPE_RENT: ListTypeEnum = ListTypeEnum.rent;

  /**
   * Constructor
   */
  constructor(
    protected pageService: CustomAttributePageService,
    protected activatedRoute: ActivatedRoute,
    protected propertySearchlistService: PropertySearchlistService,
    protected promotionSearchlistService: PromotionSearchlistService,
    protected contactSearchlistService: ContactSearchlistService,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }

  /**
   * Return a searchlist UID based on provided name
   */
  getSearchlistUid(name: string): string {

    if (name === this.PAGE_TAB_PROPERTY_SALE) {

      return this.propertySearchlistService.getUid(name);

    }

    if (name === this.PAGE_TAB_PROPERTY_RENT) {

      return this.propertySearchlistService.getUid(name);

    }

    if (name === this.PAGE_TAB_PROMOTION) {

      return this.promotionSearchlistService.getUid(name);

    }

    if (name === this.PAGE_TAB_CONTACT) {

      return this.contactSearchlistService.getUid(name);
    }

    return '';
  }
}
