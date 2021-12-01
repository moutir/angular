import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dictionary } from '../../shared/class/dictionary';

import { CustomAttributeModel } from '../../shared/model/custom-attribute.model';
import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { CustomAttributePageService } from '../../core/shared/custom-attribute/custom-attribute-page.service';
import { CustomAttributeOptionsInterface } from '../../shared/interface/custom-attribute-options.interface';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';

@Component({
  selector: 'app-custom-attribute-page-write',
  templateUrl: './custom-attribute-page-write.component.html',
  styleUrls: ['./custom-attribute-page-write.component.scss'],
})
export class CustomAttributePageWriteComponent extends PageWriteComponentAbstract<CustomAttributeModel, CustomAttributeOptionsInterface> {

  /**
   * Constants
   */
  readonly PAGE_TAB_REQUIRED: PageTabEnum = PageTabEnum.customAttributeWriteRequired;

  /**
   * Constructor
   */
  constructor(
    protected pageService: CustomAttributePageService,
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
    const model = new CustomAttributeModel();

    // TODO[nico] Replace by logic "all form's attribute" (search for it)
    Object
      .keys(model)
      .forEach(field => fieldTabMapping[field] = PageTabEnum.customAttributeWriteRequired);

    return fieldTabMapping;
  }
}
