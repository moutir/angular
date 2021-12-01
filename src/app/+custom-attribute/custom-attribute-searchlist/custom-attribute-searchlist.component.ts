import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { CustomAttributeModel } from '../../shared/model/custom-attribute.model';
import { CustomAttributeSearchOptionsInterface } from '../../shared/interface/custom-attribute-search-options.interface';
import { CustomAttributeSearchModel } from '../../shared/model/custom-attribute-search.model';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { CustomAttributeSearchlistService } from '../../core/shared/custom-attribute/custom-attribute-searchlist.service';
import { CustomAttributeConfig } from '../../core/shared/custom-attribute/custom-attribute.config';
import { MenuItemInterface } from '../../shared/interface/menu-item.interface';
import { OperationEnum } from '../../shared/enum/operation.enum';
import { CustomAttributeService } from '../../core/shared/custom-attribute/custom-attribute.service';

@Component({
  selector: 'app-custom-attribute-searchlist',
  templateUrl: './custom-attribute-searchlist.component.html',
  styleUrls: ['./custom-attribute-searchlist.component.scss'],
})
export class CustomAttributeSearchlistComponent extends SearchlistComponentAbstract<
  CustomAttributeModel,
  CustomAttributeSearchModel,
  CustomAttributeSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: CustomAttributeConfig,
    protected searchlistService: CustomAttributeSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected customAttributeService: CustomAttributeService,
  ) {

    super(moduleConfig, searchlistService, runtimeService, router);
  }

  /**
   * @inheritDoc
   */
  onClickMenuItemOperation(menuItem: MenuItemInterface): void {

    // Parent
    super.onClickMenuItemOperation(menuItem);

    this
      .selection$
      .pipe(take(1))
      .subscribe(selection => {

        // Operations that trigger instantly
        switch (menuItem.id) {

          case OperationEnum.customAttributeDelete:
            this.customAttributeService.remove(selection.ids[0]); // TODO[sudheesh]: Do we have the bulk action remove?
            break;
        }

        // Reset current operation
        this.resetOperation();
      });
  }
}
