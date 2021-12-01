import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { PortalModel } from '../../shared/model/portal.model';
import { PortalPageService } from '../../core/shared/portal/portal-page-service';
import { PortalSearchlistService } from '../../core/shared/portal/portal-searchlist.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';

@Component({
  selector: 'app-portal-page-read',
  templateUrl: './portal-page-read.component.html',
  styleUrls: ['./portal-page-read.component.scss'],
})
export class PortalPageReadComponent extends PageReadComponentAbstract<PortalModel, {}> {

  /**
   * Constants
   */
  readonly PAGE_TAB_INFORMATION: PageTabEnum = PageTabEnum.portalReadInformation;
  readonly PAGE_TAB_OUTPUT: PageTabEnum = PageTabEnum.portalReadOutput;

  /**
   * Show FTP password when flag is true
   */
  showFtpPassword: boolean = false;

  /**
   * State observables
   */
  agencyCountry$: Observable<string>;
  portalLanguage$: Observable<string>;
  portal$: Observable<string>;
  agencyWebsite$: Observable<string>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: PortalPageService,
    protected activatedRoute: ActivatedRoute,
    protected portalSearchlistService: PortalSearchlistService,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }

  /**
   * Show FTP password when button clicked
   */
  onClickShowFtpPasswordButton(): void {

    this.showFtpPassword = true;
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.agencyCountry$ = this.pageService.selectAgencyCountry();
    this.portalLanguage$ = this.pageService.selectPortalLanguage();
    this.portal$ = this.pageService.selectPortal();
    this.agencyWebsite$ = this.pageService.selectAgencyWebsite();
  }
}
