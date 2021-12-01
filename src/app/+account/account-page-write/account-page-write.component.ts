import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dictionary } from 'app/shared/class/dictionary';
import { Observable } from 'rxjs';

import { AccountModel } from '../../shared/model/account.model';
import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { AccountPageService } from '../../core/shared/account/account-page.service';
import { AccountOptionsInterface } from '../../shared/interface/account-options.interface';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RuntimeFeatureAccountInterface } from '../../shared/interface/runtime-feature-account.interface';
import { AccountModelAdapterStrategy } from '../../core/shared/account/account-model-adapter.strategy';

@Component({
  selector: 'app-account-page-write',
  templateUrl: './account-page-write.component.html',
  styleUrls: ['./account-page-write.component.scss'],
})
export class AccountPageWriteComponent extends PageWriteComponentAbstract<AccountModel, AccountOptionsInterface> {

  /**
   * Constants
   */
  readonly PAGE_TAB_REQUIRED: PageTabEnum = PageTabEnum.accountWriteRequired;

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
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    private runtimeService: RuntimeService,
    private modelAdapterStrategy: AccountModelAdapterStrategy,
  ) {

    super(
      pageService,
      formService,
      activatedRoute,
    );
  }

  /**
   * @inheritDoc
   */
  protected getFieldTabMapping(): Dictionary<PageTabEnum> {

    const fieldTabMapping: Dictionary<PageTabEnum> = {};
    const model = new AccountModel();

    // Set all form's attribute into required tab
    Object
      .keys(this.modelAdapterStrategy.getFormControlConfig(model))
      .forEach((controlName) => fieldTabMapping[controlName] = PageTabEnum.accountWriteRequired);

    return fieldTabMapping;
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
