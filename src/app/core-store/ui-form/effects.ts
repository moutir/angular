import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { FormEventError } from './actions/form-event-error';
import { FormService } from '../../core/shared/form.service';
import { FormUpdateModelError } from './actions/form-update-model-error';

@Injectable()
export class Effects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private formService: FormService,
  ) {

  }

  /**
   * Update form error after event error
   *
   * @action FormEventError
   */
  FormEventError$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<FormEventError>(FormEventError.TYPE),
    switchMap(action => zip(
      of(action),
      this.formService.selectModelError(action.payload.uid),
    )),
    map(([action, modelError]) => {

      const newModelError = {
        ...modelError,
      };

      newModelError[action.payload.name] = action.payload.error || null;

      return new FormUpdateModelError({
        uid: action.payload.uid,
        modelError: newModelError,
      });
    }),
  ));
}
