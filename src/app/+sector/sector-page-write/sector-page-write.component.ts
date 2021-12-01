import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SectorModel } from '../../shared/model/sector.model';
import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { SectorPageService } from '../../core/shared/sector/sector-page.service';
import { SectorOptionsInterface } from '../../shared/interface/sector-options.interface';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { Dictionary } from '../../shared/class/dictionary';

@Component({
  selector: 'app-sector-page-write',
  templateUrl: './sector-page-write.component.html',
  styleUrls: ['./sector-page-write.component.scss'],
})
export class SectorPageWriteComponent extends PageWriteComponentAbstract<SectorModel, SectorOptionsInterface> {

  /**
   * Constants
   */
  readonly PAGE_TAB_REQUIRED: PageTabEnum = PageTabEnum.sectorWriteRequired;

  /**
   * Constructor
   */
  constructor(
    protected pageService: SectorPageService,
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
    const model = new SectorModel();

    // TODO[nico] Replace by logic "all form's attribute" (search for it)
    Object
      .keys(model)
      .forEach(field => fieldTabMapping[field] = PageTabEnum.sectorWriteRequired);

    return fieldTabMapping;
  }
}
