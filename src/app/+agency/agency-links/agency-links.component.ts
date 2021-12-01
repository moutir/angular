import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeAuthenticationInterface } from '../../shared/interface/runtime-authentication.interface';
import { AgencyPreferenceConfig } from '../../core/shared/agency-preference/agency-preference.config';
import { AgencyConfig } from '../../core/shared/agency/agency.config';
import { PortalConfig } from '../../core/shared/portal/portal.config';
import { DeviceConfig } from '../../core/shared/device/device.config';
import { DnsConfig } from '../../core/shared/dns/dns.config';
import { SectorConfig } from '../../core/shared/sector/sector.config';
import { CustomAttributeConfig } from '../../core/shared/custom-attribute/custom-attribute.config';
import { RestrictionConfig } from '../../core/shared/restriction/restriction.config';
import { AccountConfig } from '../../core/shared/account/account.config';
import { MlsConfig } from '../../core/shared/mls/mls.config';
import { WebsiteConfig } from '../../core/shared/website/website.config';
import { WebsiteArticleConfig } from '../../core/shared/website-article/website-article.config';
import { ProcessConfig } from '../../core/shared/process/process.config';

@Component({
  selector: 'app-agency-links',
  templateUrl: './agency-links.component.html',
  styleUrls: ['./agency-links.component.scss'],
})
export class AgencyLinksComponent implements OnInit {

  /**
   * Constants
   */
  readonly PERMISSION_AGENCY_PRODUCTION_READ: PermissionEnum = PermissionEnum.agencyProductionRead;

  /**
   * State observables
   */
  runtimeFeature$: Observable<RuntimeFeatureInterface>;
  runtimePermissions$: Observable<PermissionEnum[]>;
  runtimeAuthentication$: Observable<RuntimeAuthenticationInterface>;

  /**
   * Constructor
   */
  constructor(
    private runtimeService: RuntimeService,
    public agencyConfig: AgencyConfig,
    public agencyPreferenceConfig: AgencyPreferenceConfig,
    public portalConfig: PortalConfig,
    public deviceConfig: DeviceConfig,
    public dnsConfig: DnsConfig,
    public sectorConfig: SectorConfig,
    public customAttributeConfig: CustomAttributeConfig,
    public restrictionConfig: RestrictionConfig,
    public accountConfig: AccountConfig,
    public mlsConfig: MlsConfig,
    public websiteConfig: WebsiteConfig,
    public websiteArticleConfig: WebsiteArticleConfig,
    public processConfig: ProcessConfig,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Set state observables
    this.runtimeFeature$ = this.runtimeService.selectFeature();
    this.runtimePermissions$ = this.runtimeService.selectPermissions();
    this.runtimeAuthentication$ = this.runtimeService.selectAuthentication();
  }
}
