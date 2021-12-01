import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { StateInterface } from '../../core-store/state.interface';
import { selectUiGeneralError, selectUiModelError } from '../../core-store/ui-form/selectors';
import { FormSet } from '../../core-store/ui-form/actions/form-set';
import { FormEventError } from '../../core-store/ui-form/actions/form-event-error';
import { KeyValueType } from '../../shared/type/key-value.type';
import { GeneralErrorInterface } from '../../shared/interface/general-error.interface';

@Injectable()
export class FormService {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
  ) {

  }

  /**
   * Select model error
   */
  selectModelError(uid: string): Observable<KeyValueType<string, string|null>> {

    return this.store$.select(selectUiModelError(uid));
  }

  /**
   * Select general error
   */
  selectGeneralError(uid: string): Observable<GeneralErrorInterface[]> {

    return this.store$.select(selectUiGeneralError(uid));
  }

  /**
   * Form has an error
   */
  error(uid: string, name: string, error: string|null): void {

    this.store$.dispatch(
      new FormEventError({
        uid,
        name,
        error,
      }),
    );
  }

  /**
   * Register a new form
   */
  register(uid: string): void {

    this.store$.dispatch(
      new FormSet({
        uid: uid,
        form: {
          modelError: {},
          generalError: [],
        },
      }),
    );
  }

  /**
   * Unregister autocomplete
   */
  unregister(uid: string): void {

    this.store$.dispatch(
      new FormSet({
        uid,
        form: null,
      }),
    );
  }
}
