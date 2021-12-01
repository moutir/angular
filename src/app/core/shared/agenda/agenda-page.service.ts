import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { AgendaConfig } from './agenda.config';
import { AgendaModel } from '../../../shared/model/agenda.model';
import { AgendaOptionsInterface } from '../../../shared/interface/agenda-options.interface';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { AgendaService } from './agenda.service';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';

@Injectable()
export class AgendaPageService extends PageServiceAbstract<AgendaModel, AgendaOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: AgendaConfig,
    protected modelService: AgendaService,
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

    super.setPage(type, 'agenda');
  }

  /**
   * @inheritDoc
   */
  redirect(type: PageTypeEnum|null, id: string|null): void {

    // Home
    if (type === PageTypeEnum.read) {

      this.router.navigate(['/dashboard']);
      return;
    }
  }

  /**
   * @inheritDoc
   */
  selectModel(): Observable<AgendaModel> {

    return combineLatest([
      this.store$.select(this.getSelectorModel()),
      this.runtimeService.selectOptions(),
    ]).pipe(
      map(([model, runtimeOptions]) => {

        const newModel = model.clone<AgendaModel>();

        if (!newModel.calendarId && runtimeOptions.agenda && runtimeOptions.agenda.length > 0) {

          newModel.calendarId = runtimeOptions.agenda[0].value;
        }

        return newModel;
      }),
    );
  }

  /**
   * @inheritDoc
   */
  protected getModelPageTitle(model: AgendaModel, language: LanguageEnum): string {

    return 'label_agenda';
  }

  /**
   * @inheritDoc
   */
  protected getSelectorSubtitles(): MemoizedSelector<StateInterface, string[]> {

    return createSelector(
      selectDataPermissions,
      (
        permissions: PermissionEnum[],
      ): string[] => {

        // No read permission
        if (permissions.indexOf(this.moduleConfig.PERMISSION_READ) === -1) {

          return ['breadcrumb_access_denied'];
        }

        return ['label_list'];
      },
    );
  }
  /**
   * @inheritDoc
   */
  protected getSelectorOptions(): MemoizedSelector<StateInterface, AgendaOptionsInterface> {

    return createSelector(
      this.runtimeService.getSelectorOptions(),
      (
        options: RuntimeOptionsInterface,
      ): AgendaOptionsInterface => {

        return {
          agenda: options.agenda,
        };
      },
    );
  }
}
