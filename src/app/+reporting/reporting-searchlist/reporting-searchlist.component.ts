import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { ReportingModel } from '../../shared/model/reporting.model';
import { ReportingSearchOptionsInterface } from '../../shared/interface/reporting-search-options.interface';
import { ReportingSearchlistService } from '../../core/shared/reporting/reporting-searchlist.service';
import { ReportingSearchModel } from '../../shared/model/reporting-search.model';
import { OperationEnum } from '../../shared/enum/operation.enum';
import { MenuItemInterface } from '../../shared/interface/menu-item.interface';
import { ReportingService } from '../../core/shared/reporting/reporting.service';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeAuthenticationInterface } from '../../shared/interface/runtime-authentication.interface';
import { ReportingConfig } from '../../core/shared/reporting/reporting.config';

@Component({
  selector: 'app-reporting-searchlist',
  templateUrl: './reporting-searchlist.component.html',
  styleUrls: ['./reporting-searchlist.component.scss'],
})
export class ReportingSearchlistComponent extends SearchlistComponentAbstract<
  ReportingModel,
  ReportingSearchModel,
  ReportingSearchOptionsInterface
> {

  /**
   * State observables
   */
  runtimePermissions$: Observable<PermissionEnum[]>;
  runtimeAuthentication$: Observable<RuntimeAuthenticationInterface>;

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: ReportingConfig,
    protected searchlistService: ReportingSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected reportingService: ReportingService,

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

          case OperationEnum.reportingSend:
            this.reportingService.accept(selection.ids);
            break;

          case OperationEnum.reportingRefuse:
            this.reportingService.reject(selection.ids);
            break;
        }

        // Reset current operation
        this.resetOperation();
      });
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.runtimePermissions$ = this.runtimeService.selectPermissions();
    this.runtimeAuthentication$ = this.runtimeService.selectAuthentication();
  }
}
