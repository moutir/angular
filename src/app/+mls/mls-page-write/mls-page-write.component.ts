import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MlsModel } from '../../shared/model/mls.model';
import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { MlsPageService } from '../../core/shared/mls/mls-page.service';
import { MlsOptionsInterface } from '../../shared/interface/mls-options.interface';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { Dictionary } from '../../shared/class/dictionary';
import { MlsModelAdapterStrategy } from '../../core/shared/mls/mls-model-adapter.strategy';

@Component({
  selector: 'app-mls-page-write',
  templateUrl: './mls-page-write.component.html',
  styleUrls: ['./mls-page-write.component.scss'],
})
export class MlsPageWriteComponent extends PageWriteComponentAbstract<MlsModel, MlsOptionsInterface> {

  /**
   * Constants
   */
  readonly PAGE_TAB_OVERVIEW: PageTabEnum = PageTabEnum.mlsWriteOverview;

  /**
   * Constructor
   */
  constructor(
    protected pageService: MlsPageService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    private modelAdapterStrategy: MlsModelAdapterStrategy,
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
    const model = new MlsModel();

    // Set up field mapping
    Object
      .keys(this.modelAdapterStrategy.getFormControlConfig(model))
      .forEach(field => fieldTabMapping[field] = PageTabEnum.mlsWriteOverview);

    return fieldTabMapping;
  }
}
