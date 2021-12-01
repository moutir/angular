import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { PortalModel } from '../../shared/model/portal.model';
import { PortalPageService } from '../../core/shared/portal/portal-page-service';
import { PortalModelRequiredAdapterStrategy } from '../../core/shared/portal/portal-model-required-adapter.strategy';
import { PortalModelContactAdapterStrategy } from '../../core/shared/portal/portal-model-contact-adapter.strategy';
import { PortalModelTechnicalAdapterStrategy } from '../../core/shared/portal/portal-model-technical-adapter.strategy';
import { PortalModelSettingsAdapterStrategy } from '../../core/shared/portal/portal-model-settings-adapter.strategy';
import { Dictionary } from '../../shared/class/dictionary';
import { RuntimeFeaturePortalInterface } from '../../shared/interface/runtime-feature-portal.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';

@Component({
  selector: 'app-portal-page-write',
  templateUrl: './portal-page-write.component.html',
  styleUrls: ['./portal-page-write.component.scss'],
})
export class PortalPageWriteComponent extends PageWriteComponentAbstract<PortalModel, {}> {

  /**
   * Constants
   */
  readonly PAGE_TAB_REQUIRED: PageTabEnum = PageTabEnum.portalWriteRequired;
  readonly PAGE_TAB_CONTACT: PageTabEnum = PageTabEnum.portalWriteContact;
  readonly PAGE_TAB_TECHNICAL: PageTabEnum = PageTabEnum.portalWriteTechnical;
  readonly PAGE_TAB_SETTINGS: PageTabEnum = PageTabEnum.portalWriteSettings;

  /**
   * State observables
   */
  featurePortal$: Observable<RuntimeFeaturePortalInterface>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: PortalPageService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    private runtimeService: RuntimeService,
    private portalRequiredAdapterStrategy: PortalModelRequiredAdapterStrategy,
    private portalContactAdapterStrategy: PortalModelContactAdapterStrategy,
    private portalTechnicalAdapterStrategy: PortalModelTechnicalAdapterStrategy,
    private portalSettingsAdapterStrategy: PortalModelSettingsAdapterStrategy,
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
    const model = new PortalModel();

    // Set up required tab fields
    Object
      .keys(this.portalRequiredAdapterStrategy.getFormControlConfig(model))
      .forEach((controlName) => fieldTabMapping[controlName] = PageTabEnum.portalWriteRequired);

    // Set up contact tab fields
    Object
      .keys(this.portalContactAdapterStrategy.getFormControlConfig(model))
      .forEach((controlName) => fieldTabMapping[controlName] = PageTabEnum.portalWriteContact);

    // Set up technical tab fields
    Object
      .keys(this.portalTechnicalAdapterStrategy.getFormControlConfig(model))
      .forEach((controlName) => fieldTabMapping[controlName] = PageTabEnum.portalWriteTechnical);

    // Set up settings tab fields
    Object
      .keys(this.portalSettingsAdapterStrategy.getFormControlConfig(model))
      .forEach((controlName) => fieldTabMapping[controlName] = PageTabEnum.portalWriteSettings);

    return fieldTabMapping;
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    // Set state observables
    this.featurePortal$ = this.runtimeService.selectFeaturePortal();
  }
}
