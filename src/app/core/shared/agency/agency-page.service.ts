import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { AgencyConfig } from './agency.config';
import { AgencyModel } from '../../../shared/model/agency.model';
import { AgencyOptionsInterface } from '../../../shared/interface/agency-options.interface';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { AgencyService } from './agency.service';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { LanguageEnum } from '../../../shared/enum/language.enum';

@Injectable()
export class AgencyPageService extends PageServiceAbstract<AgencyModel, AgencyOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: AgencyConfig,
    protected modelService: AgencyService,
  ) {

    super(
      store$,
      runtimeService,
      router,
      moduleConfig,
      modelService,
    );
  }

  /**
   * @inheritDoc
   */
  setPage(type: PageTypeEnum, id: string|null): void {

    super.setPage(type, 'agency');
  }

  /**
   * @inheritDoc
   */
  redirect(type: PageTypeEnum|null, id: string|null): void {

    // Home
    if (type !== PageTypeEnum.read) {

      this.router.navigate(['/dashboard']);
      return;
    }
  }

  /**
   * @inheritDoc
   */
  protected getModelPageTitle(model: AgencyModel, language: LanguageEnum): string {

    return 'page_header_agency';
  }
}
