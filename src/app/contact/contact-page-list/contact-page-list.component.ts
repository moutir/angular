import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { BrowserService } from '../../core/shared/browser/browser.service';
import { ContactModel } from '../../shared/model/contact.model';
import { ContactSearchOptionsInterface } from '../../shared/interface/contact-search-options.interface';
import { ContactSearchModel } from '../../shared/model/contact-search.model';
import { ContactSearchlistService } from '../../core/shared/contact/contact-searchlist.service';
import { ContactService } from '../../core/shared/contact/contact.service';
import { ContactConfig } from '../../core/shared/contact/contact.config';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { ContactPageService } from '../../core/shared/contact/contact-page.service';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RouterService } from '../../core/shared/router/router.service';
import { RuntimeAuthenticationInterface } from '../../shared/interface/runtime-authentication.interface';
import { RuntimeUserPreferenceInterface } from '../../shared/interface/runtime-user-preference.interface';
import { BetaEnum } from '../../shared/enum/beta.enum';

@Component({
  selector: 'app-contact-page-list',
  templateUrl: './contact-page-list.component.html',
  styleUrls: ['./contact-page-list.component.scss'],
})
export class ContactPageListComponent extends PageListComponentAbstract<
  ContactModel,
  ContactSearchModel,
  ContactSearchOptionsInterface
> {

  /**
   * Is user subscribed to beta performance
   */
  isBetaPerformance: boolean|null = null;

  /**
   * State observables
   */
  runtimePermissions$: Observable<PermissionEnum[]>;
  runtimeAuthentication$: Observable<RuntimeAuthenticationInterface>;
  runtimeUserPreference$: Observable<RuntimeUserPreferenceInterface>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: ContactPageService,
    protected searchlistService: ContactSearchlistService,
    protected browserService: BrowserService,
    protected activatedRoute: ActivatedRoute,
    protected moduleConfig: ContactConfig,
    protected contactService: ContactService,
    protected routerService: RouterService,
    private runtimeService: RuntimeService,
  ) {

    super(
      pageService,
      searchlistService,
      browserService,
      activatedRoute,
      routerService,
    );
    
    // TODO[later] remove once fully on Angular and stop using BE session for a stupid basket, this is FE only!
    this.contactService.setBasket(moduleConfig.basketContactIds);
  }

  /**
   * Clicked the beta input
   */
  public onClickBeta(): void {

    this.runtimeService.toggleBeta(BetaEnum.performance);
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.runtimePermissions$ = this.runtimeService.selectPermissions();
    this.runtimeAuthentication$ = this.runtimeService.selectAuthentication();
    this.runtimeUserPreference$ = this.runtimeService.selectUserPreference();

    this.subscriptions.push(
      this.runtimeUserPreference$.subscribe(userPreference => this.onNextUserPreference(userPreference)),
    );
  }

  /**
   * Next user preference
   */
  private onNextUserPreference(userPreference: RuntimeUserPreferenceInterface): void {

    const isBetaPerformance = !!userPreference.beta && !!userPreference.beta[BetaEnum.performance];

    // First initialisation
    if (this.isBetaPerformance === null) {

      this.isBetaPerformance = isBetaPerformance;

      return;
    }

    if (isBetaPerformance !== this.isBetaPerformance) {

      // Update beta performance state
      this.isBetaPerformance = isBetaPerformance;

      // Reload base URL
      const location = this.browserService.getWindow().location;
      this.browserService.redirect(location.origin + '/' + location.pathname);
    }
  }
}
