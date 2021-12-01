import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { RestrictionModel } from '../../shared/model/restriction.model';
import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { RestrictionPageService } from '../../core/shared/restriction/restriction-page.service';
import { RestrictionOptionsInterface } from '../../shared/interface/restriction-options.interface';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { RestrictionRuleType } from '../../shared/type/restriction-rule.type';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RuntimeAuthenticationInterface } from '../../shared/interface/runtime-authentication.interface';

@Component({
  selector: 'app-restriction-page-read',
  templateUrl: './restriction-page-read.component.html',
  styleUrls: ['./restriction-page-read.component.scss'],
})
export class RestrictionPageReadComponent extends PageReadComponentAbstract<RestrictionModel, RestrictionOptionsInterface> {

  /**
   * Constants
   */
  readonly PAGE_TAB_INFORMATION: PageTabEnum = PageTabEnum.restrictionReadInformation;
  readonly RULE_TYPES: RestrictionRuleType[] = ['condition', 'validation'];
  readonly PERMISSION_AGENCY_GROUP_ADMIN: PermissionEnum = PermissionEnum.agencyGroupAdmin;

  /**
   * State observables
   */
  authentication$: Observable<RuntimeAuthenticationInterface>;
  permissions$: Observable<PermissionEnum[]>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: RestrictionPageService,
    protected activatedRoute: ActivatedRoute,
    protected runtimeService: RuntimeService,
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
    this.authentication$ = this.runtimeService.selectAuthentication();
    this.permissions$ = this.runtimeService.selectPermissions();
  }
}
