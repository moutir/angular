import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';

import { StateInterface } from '../../../core-store/state.interface';
import { RuntimeUserPreferenceInterface } from '../../../shared/interface/runtime-user-preference.interface';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { UserModel } from '../../../shared/model/user.model';
import { UserApiService } from '../../../api/shared/user/user-api.service';
import { selectDataUser } from '../../../core-store/data-user/selectors';
import { UserSavePreferenceResponseInterface } from '../../../api/shared/user/user-save-preference-response.interface';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { catchError, map } from 'rxjs/operators';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { LegacyParserService } from '../../../api/format/legacy/legacy-parser.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { UserConfig } from './user.config';

@Injectable()
export class UserService extends ModelServiceAbstract<UserModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private moduleConfig: UserConfig,
    private userApiService: UserApiService,
    private legacyParserService: LegacyParserService,
    private runtimeService: RuntimeService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  load(id: string): Observable<UserModel> {

    return this
      .userApiService
      .load();
  }

  /**
   * @inheritDoc
   */
  save(model: UserModel): Observable<ModelSaveInterface> {

    // TODO[nico] runtimeService.resetData() should happen in an effect

    return zip(
      this.userApiService.save(model),
      this.runtimeService.selectCurrentLanguageId(),
    ).pipe(
      map(([response, currentLanguageId]) => {

        // Language updated
        if (model.account.language.value !== currentLanguageId) {

          // Reset runtime data - settings and options
          this.runtimeService.resetData([RuntimeDataEnum.settings, RuntimeDataEnum.options]);
        }

        return this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING);
      }),
      catchError(response => of(
        this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING),
      )),
    );
  }

  /**
   * @inheritDoc
   */
  factory(): UserModel {

    return new UserModel();
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<UserModel|null> {

    return this.store$.select(selectDataUser(id));
  }

  /**
   * Save preference
   */
  savePreference(preference: RuntimeUserPreferenceInterface): Observable<UserSavePreferenceResponseInterface> {

    return this.userApiService.savePreference(preference);
  }
}
