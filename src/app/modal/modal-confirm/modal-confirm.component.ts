import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ModalComponentAbstract } from '../modal/modal-component.abstract';
import { ConfirmService } from '../../core/shared/confirm.service';
import { Confirm } from '../../shared/class/confirm';

@Component({
  selector: 'app-shared-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss'],
})
export class ModalConfirmComponent extends ModalComponentAbstract<null> implements OnInit, OnDestroy {

  /**
   * Confirm model (considered NOT translated)
   */
  confirm: Confirm = new Confirm();

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private modalService: ConfirmService,
  ) {

    super();
  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Updated notifications
    this.subscriptions.push(
      this.modalService.selectConfirm().subscribe(confirm => this.onNextConfirm(confirm)),
    );
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * @inheritDoc
   */
  onClickButton(isValid: boolean): void {

    super.onClickButton(isValid);

    this.confirm.answer(isValid);
    this.deactivate();
  }

  /**
   * Next confirm
   */
  private onNextConfirm(confirm: Confirm): void {

    this.confirm = confirm;
    this.activate();
  }
}
