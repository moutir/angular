import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AccountModel } from '../../shared/model/account.model';
import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { AccountPageService } from '../../core/shared/account/account-page.service';
import { AccountOptionsInterface } from '../../shared/interface/account-options.interface';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { Observable } from 'rxjs';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RuntimeFeatureAccountInterface } from '../../shared/interface/runtime-feature-account.interface';

@Component({
  selector: 'app-account-page-read',
  templateUrl: './account-page-read.component.html',
  styleUrls: ['./account-page-read.component.scss'],
})
export class AccountPageReadComponent extends PageReadComponentAbstract<AccountModel, AccountOptionsInterface> implements OnInit {

  /**
   * Constants
   */
  readonly PAGE_TAB_INFORMATION: PageTabEnum = PageTabEnum.accountReadInformation;
  readonly PERMISSION_AGENDA_READ: PermissionEnum = PermissionEnum.agendaRead;

  /**
   * State observables
   */
  runtimePermissions$: Observable<PermissionEnum[]>;
  runtimeFeature$: Observable<RuntimeFeatureInterface>;
  runtimeFeatureAccount$: Observable<RuntimeFeatureAccountInterface>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: AccountPageService,
    protected activatedRoute: ActivatedRoute,
    private runtimeService: RuntimeService,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    // Set state observables
    this.runtimePermissions$ = this.runtimeService.selectPermissions();
    this.runtimeFeature$ = this.runtimeService.selectFeature();
    this.runtimeFeatureAccount$ = this.runtimeService.selectFeatureAccount();
  }
}
