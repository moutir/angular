import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { MatchingModel } from '../../shared/model/matching.model';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { MatchingSearchModel } from '../../shared/model/matching-search.model';
import { MatchingSearchOptionsInterface } from '../../shared/interface/matching-search-options.interface';
import { MatchingSearchlistService } from '../../core/shared/matching/matching-searchlist.service';
import { OperationEnum } from '../../shared/enum/operation.enum';
import { MatchingService } from '../../core/shared/matching/matching.service';
import { MenuItemInterface } from '../../shared/interface/menu-item.interface';
import { MatchingConfig } from '../../core/shared/matching/matching.config';

@Component({
  selector: 'app-matching-searchlist',
  templateUrl: './matching-searchlist.component.html',
  styleUrls: ['./matching-searchlist.component.scss'],
})
export class MatchingSearchlistComponent extends SearchlistComponentAbstract<
  MatchingModel,
  MatchingSearchModel,
  MatchingSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: MatchingConfig,
    protected searchlistService: MatchingSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected matchingService: MatchingService,
  ) {

    super(moduleConfig, searchlistService, runtimeService, router);
  }

  /**
   * @inheritDoc
   */
  onClickModel(model: MatchingModel): void {

    // Do nothing!
    return;
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

          case OperationEnum.matchingWaiting:
            this.matchingService.waiting(selection.ids);
            break;
        }

        // Reset current operation
        this.resetOperation();
      });
  }
}
