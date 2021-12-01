import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RestrictionModel } from '../../shared/model/restriction.model';
import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { RestrictionPageService } from '../../core/shared/restriction/restriction-page.service';
import { RestrictionOptionsInterface } from '../../shared/interface/restriction-options.interface';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { Dictionary } from '../../shared/class/dictionary';

@Component({
  selector: 'app-restriction-page-write',
  templateUrl: './restriction-page-write.component.html',
  styleUrls: ['./restriction-page-write.component.scss'],
})
export class RestrictionPageWriteComponent extends PageWriteComponentAbstract<RestrictionModel, RestrictionOptionsInterface> {

  /**
   * Constants
   */
  readonly PAGE_TAB_REQUIRED: PageTabEnum = PageTabEnum.restrictionWriteRequired;

  /**
   * Constructor
   */
  constructor(
    protected pageService: RestrictionPageService,
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
    const model = new RestrictionModel();

    // TODO[nico] Replace by logic "all form's attribute" (search for it)
    Object
      .keys(model)
      .forEach(field => fieldTabMapping[field] = PageTabEnum.restrictionWriteRequired);

    return fieldTabMapping;
  }
}
