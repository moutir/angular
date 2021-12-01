import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dictionary } from 'app/shared/class/dictionary';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { UserModel } from '../../shared/model/user.model';
import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RuntimeFeatureAccountInterface } from '../../shared/interface/runtime-feature-account.interface';
import { DocumentModel } from '../../shared/model/document.model';
import { ContactModelAdapterStrategy } from '../../core/shared/contact/contact-model-adapter.strategy';
import { AccountModelAdapterStrategy } from '../../core/shared/account/account-model-adapter.strategy';
import { ChangeFormEventInterface } from '../../shared/interface/change-form-event.interface';
import { ContactModel } from '../../shared/model/contact.model';
import { AccountModel } from '../../shared/model/account.model';
import { UserOptionsInterface } from '../../shared/interface/user-options.interface';
import { UserPageService } from '../../core/shared/user/user-page.service';

@Component({
  selector: 'app-user-page-write',
  templateUrl: './user-page-write.component.html',
  styleUrls: ['./user-page-write.component.scss'],
})
export class UserPageWriteComponent extends PageWriteComponentAbstract<UserModel, UserOptionsInterface> {

  /**
   * Constants
   */
  readonly PAGE_TAB_PROFILE: PageTabEnum = PageTabEnum.userWriteContact;
  readonly PAGE_TAB_DOCUMENT: PageTabEnum = PageTabEnum.userWriteDocument;
  readonly PAGE_TAB_ACCOUNT: PageTabEnum = PageTabEnum.userWriteAccount;

  /**
   * State observables
   */
  runtimePermissions$: Observable<PermissionEnum[]>;
  runtimeFeature$: Observable<RuntimeFeatureInterface>;
  runtimeFeatureAccount$: Observable<RuntimeFeatureAccountInterface>;

  /**
   * Documents
   */
  documents: DocumentModel[] = [];
  documentsHash: string = '';

  /**
   * Constructor
   */
  constructor(
    protected pageService: UserPageService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    private runtimeService: RuntimeService,
    private contactModelAdapterStrategy: ContactModelAdapterStrategy,
    private accountModelAdapterStrategy: AccountModelAdapterStrategy,
  ) {

    super(
      pageService,
      formService,
      activatedRoute,
    );
  }

  /**
   * Changed form: contact
   */
  onChangeFormContact(event: ChangeFormEventInterface<ContactModel>): void {

    this
      .model$
      .pipe(take(1))
      .subscribe(model => {

        const newModel = model.clone<UserModel>();

        newModel.account.contact = event.model;

        this.onChangeForm({
          ...event,
          model: newModel,
        });
      });
  }

  /**
   * Changed form: account
   */
  onChangeFormAccount(event: ChangeFormEventInterface<AccountModel>): void {

    this
      .model$
      .pipe(take(1))
      .subscribe(model => {

        const newModel = model.clone<UserModel>();

        newModel.account = event.model;

        this.onChangeForm({
          ...event,
          model: newModel,
        });
      });
  }

  /**
   * @inheritDoc
   */
  protected getFieldTabMapping(): Dictionary<PageTabEnum> {

    const fieldTabMapping: Dictionary<PageTabEnum> = {};
    const model = new UserModel();

    // Set up account tab fields
    Object
      .keys(this.accountModelAdapterStrategy.getFormControlConfig(model.account))
      .forEach((controlName) => fieldTabMapping[controlName] = PageTabEnum.userWriteAccount)
    ;

    // Set up contact tab fields
    Object
      .keys(this.contactModelAdapterStrategy.getFormControlConfig(model.account.contact))
      .forEach((controlName) => fieldTabMapping[controlName] = PageTabEnum.userWriteContact)
    ;

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

    this.model$ = this.pageService
      .selectModel()
      .pipe(map(model => {

        const documentsHash = JSON.stringify(model.account.contact.documents);

        if (documentsHash !== this.documentsHash) {

          this.documents = model.account.contact.documents;
          this.documentsHash = documentsHash;
        }

        return model;
      }));
  }
}
