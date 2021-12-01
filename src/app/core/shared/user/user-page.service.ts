import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { UserConfig } from './user.config';
import { UserModel } from '../../../shared/model/user.model';
import { UserOptionsInterface } from '../../../shared/interface/user-options.interface';
import { UserService } from './user.service';
import { AccountPageService } from '../account/account-page.service';
import { ContactPageService } from '../contact/contact-page.service';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { AccountConfig } from '../account/account.config';
import { ContactConfig } from '../contact/contact.config';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { LanguageEnum } from '../../../shared/enum/language.enum';

@Injectable()
export class UserPageService extends PageServiceAbstract<UserModel, UserOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: UserConfig,
    protected modelService: UserService,
    private accountPageService: AccountPageService,
    private contactPageService: ContactPageService,
    private accountConfig: AccountConfig,
    private contactConfig: ContactConfig,
  ) {

    super(
      store$,
      runtimeService,
      router,
      moduleConfig,
      modelService,
    );
  }

  /**
   * @inheritDoc
   */
  setPage(type: PageTypeEnum, id: string|null): void {

    super.setPage(type, 'profile');
  }

  /**
   * @inheritDoc
   */
  redirect(type: PageTypeEnum|null, id: string|null): void {

    this.router.navigate(['/dashboard']);
  }

  /**
   * @inheritDoc
   */
  protected getModelPageTitle(model: UserModel, language: LanguageEnum): string {

    return 'label_my_profile';
  }

  /**
   * @inheritDoc
   */
  protected getRequiredData(): RuntimeDataEnum[] {

    return [].concat(
      this.accountConfig.REQUIRED_DATA,
      this.contactConfig.REQUIRED_DATA,
    );
  }

  /**
   * @inheritDoc
   */
  selectOptions(): Observable<UserOptionsInterface> {

    return combineLatest([
      this.accountPageService.selectOptions(),
      this.contactPageService.selectOptions(),
    ])
    .pipe(
      map(([accountOptions, contactOptions]) => {

        return <UserOptionsInterface>{
          account: accountOptions,
          contact: contactOptions,
        };
      }),
    );
  }
}
