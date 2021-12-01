import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { ProcessConfig } from './process.config';
import { ProcessModel } from '../../../shared/model/process.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ProcessService } from './process.service';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { HelperService } from '../helper.service';
import { TranslateService } from '@ngx-translate/core';
import { DatetimePipe } from '../../../shared/pipe/datetime.pipe';

@Injectable()
export class ProcessPageService extends PageServiceAbstract<ProcessModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: ProcessConfig,
    protected modelService: ProcessService,
    private helperService: HelperService,
    private translateService: TranslateService,
    private datetimePipe: DatetimePipe,

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
  redirect(type: PageTypeEnum|null, id: string|null): void {

    // Home
    if (type === null) {

      this.router.navigate(['/agency']);
      return;
    }

    return super.redirect(type, id);
  }

  /**
   * @inheritDoc
   */
  protected getModelPageTitle(model: ProcessModel, language: LanguageEnum): string {

    return [
      this.translateService.instant('process_type_' + model.type),
      model.label,
      this.datetimePipe.transform(model.startDate),
    ].join(' / ');
  }
}
