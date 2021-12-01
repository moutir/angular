import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { AgendaPageService } from '../../core/shared/agenda/agenda-page.service';
import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { AgendaModel } from '../../shared/model/agenda.model';
import { AgendaOptionsInterface } from '../../shared/interface/agenda-options.interface';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { Dictionary } from '../../shared/class/dictionary';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeService } from '../../runtime/shared/runtime.service';

@Component({
  selector: 'app-agenda-page-write',
  templateUrl: './agenda-page-write.component.html',
})
export class AgendaPageWriteComponent extends PageWriteComponentAbstract<
  AgendaModel,
  AgendaOptionsInterface
> {

  /**
   * State observables
   */
  runtimeFeature$: Observable<RuntimeFeatureInterface>;
  runtimePermissions$: Observable<PermissionEnum[]>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: AgendaPageService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    private runtimeService: RuntimeService,
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
    const model = new AgendaModel();

    // TODO[nico] Replace by logic "all form's attribute" (search for it)
    Object
      .keys(model)
      .forEach(field => fieldTabMapping[field] = PageTabEnum.agencyPreferenceWriteRequired);

    return fieldTabMapping;
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    // Set state observables
    this.runtimeFeature$ = this.runtimeService.selectFeature();
    this.runtimePermissions$ = this.runtimeService.selectPermissions();
  }
}
