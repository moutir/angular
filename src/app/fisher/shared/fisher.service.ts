import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { FisherInterface } from './interface/fisher.interface';
import { FisherModel } from './model/fisher.model';
import { StateInterface } from '../core-store/state.interface';
import { selectUiFisherData, selectUiFisherForm, selectUiFisherOptions } from '../core-store/ui-fisher/selectors';
import { FisherEventStep } from '../core-store/ui-fisher/actions/fisher-event-step';
import { initialState } from '../core-store/ui-fisher/state';
import { FisherOptionsInterface } from './interface/fisher-options.interface';
import { InputFormInterface } from '../../shared/interface/input-form.interface';
import { FisherEventChangeInput } from '../core-store/ui-fisher/actions/fisher-event-change-input';

@Injectable()
export class FisherService {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private ngZone: NgZone,
  ) {

  }

  /**
   * Select fisher form
   */
  selectForm(): Observable<FisherInterface> {

    return this.store$.select(selectUiFisherForm);
  }

  /**
   * Select fisher data
   */
  selectData(): Observable<FisherModel> {

    return this.store$.select(selectUiFisherData);
  }

  /**
   * Select fisher options
   */
  selectOptions(): Observable<FisherOptionsInterface> {

    return this.store$.select(selectUiFisherOptions);
  }

  /**
   * Open fisher modal with first step
   */
  openModal(): void {

    this.ngZone.run(() => {

      this.store$.dispatch(new FisherEventStep({
        form: {
          ...initialState.form,
          step: 1,
        },
      }));
    });
  }

  /**
   * Close fisher modal
   */
  closeModal(): void {

    this.store$.dispatch(new FisherEventStep({
      form: {
        ...initialState.form,
        step: 0,
      },
    }));
  }

  /**
   * Update step
   */
  updateStep(form: FisherInterface): void {

    this.store$.dispatch(new FisherEventStep({
      form,
    }));
  }

  /**
   * Update form input
   */
  updateFormInput(input: InputFormInterface): void {

    this.store$.dispatch(
      new FisherEventChangeInput({
        input,
      }),
    );
  }
}
