import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { BrowserService } from '../../core/shared/browser/browser.service';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { DevicePageService } from '../../core/shared/device/device-page-service';
import { DeviceSearchlistService } from '../../core/shared/device/device-searchlist.service';
import { DeviceModel } from '../../shared/model/device.model';
import { DeviceSearchModel } from '../../shared/model/device-search.model';
import { DeviceSearchOptionsInterface } from '../../shared/interface/device-search-options.interface';
import { DeviceTypeEnum } from '../../shared/enum/device-type.enum';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-device-page-list',
  templateUrl: './device-page-list.component.html',
})
export class DevicePageListComponent extends PageListComponentAbstract<
  DeviceModel,
  DeviceSearchModel,
  DeviceSearchOptionsInterface
> {

  /**
   * State observables
   */
  typeTabIndex$: Observable<number>;
  deviceType$: Observable<DeviceTypeEnum>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: DevicePageService,
    protected searchlistService: DeviceSearchlistService,
    protected browserService: BrowserService,
    protected activatedRoute: ActivatedRoute,
    protected routerService: RouterService,
  ) {

    super(
      pageService,
      searchlistService,
      browserService,
      activatedRoute,
      routerService,
    );
  }

  /**
   * Changed tab
   */
  onChangeTab(optionIndex: number, inputName: string): void {

    this.searchlistService.reset(this.uid);
    this.searchlistService.submitByTab(this.uid, inputName, optionIndex);
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.typeTabIndex$ = this.searchlistService.selectTypeTabIndex(this.uid);
    this.deviceType$ = this.searchlistService.selectDeviceType(this.uid);
  }
}
