import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { AgencyPreferencePageService } from '../../core/shared/agency-preference/agency-preference-page.service';
import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { AgencyPreferenceModel } from '../../shared/model/agency-preference.model';
import { AgencyPreferenceOptionsInterface } from '../../shared/interface/agency-preference-options.interface';
import { AgencyPreferenceContentInterface } from '../../shared/interface/agency-preference-content.interface';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { Dictionary } from '../../shared/class/dictionary';

@Component({
  selector: 'app-agency-preference-page-write',
  templateUrl: './agency-preference-page-write.component.html',
  styleUrls: ['./agency-preference-page-write.component.scss'],
})
export class AgencyPreferencePageWriteComponent extends PageWriteComponentAbstract<
  AgencyPreferenceModel,
  AgencyPreferenceOptionsInterface
> {

  /**
   * State observable
   */
  content$: Observable<AgencyPreferenceContentInterface>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: AgencyPreferencePageService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
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
    const model = new AgencyPreferenceModel();

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

    this.content$ = this.pageService.selectContent();
  }
}
