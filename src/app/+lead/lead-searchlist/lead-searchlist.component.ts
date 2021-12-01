import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { LeadModel } from '../../shared/model/lead.model';
import { LeadSearchOptionsInterface } from '../../shared/interface/lead-search-options.interface';
import { LeadSearchModel } from '../../shared/model/lead-search.model';
import { LeadSearchlistService } from '../../core/shared/lead/lead-searchlist.service';
import { LeadService } from '../../core/shared/lead/lead.service';
import { MenuItemInterface } from '../../shared/interface/menu-item.interface';
import { OperationEnum } from '../../shared/enum/operation.enum';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { LeadConfig } from '../../core/shared/lead/lead.config';
import { LeadModifyStatusInterface } from '../../shared/interface/lead-modify-status.interface';
import { LeadModifyStatusOptionsInterface } from '../../shared/interface/lead-modify-status-options.interface';
import { ModalChoiceInterface } from '../../shared/interface/modal-choice.interface';

@Component({
  selector: 'app-lead-searchlist',
  templateUrl: './lead-searchlist.component.html',
  styleUrls: ['./lead-searchlist.component.scss'],
})
export class LeadSearchlistComponent extends SearchlistComponentAbstract<
  LeadModel,
  LeadSearchModel,
  LeadSearchOptionsInterface
> {

  /**
   * Operation names
   */
  operationNameModifyStatus: string = OperationEnum.leadModifyStatus;

  /**
   * State observables
   */
  leadModifyStatus$: Observable<LeadModifyStatusInterface>;
  leadModifyStatusOptions$: Observable<LeadModifyStatusOptionsInterface>;

  /**
   * List of operation names that have a subform
   */
  private operationSubform: string[] = [
    OperationEnum.leadModifyStatus,
  ];

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: LeadConfig,
    protected searchlistService: LeadSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected leadService: LeadService,
  ) {

    super(
      moduleConfig,
      searchlistService,
      runtimeService,
      router,
    );
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.leadModifyStatus$ = this.leadService.selectModifyStatus();
    this.leadModifyStatusOptions$ = this.leadService.selectModifyStatusOptions();
  }

  /**
   * @inheritDoc
   */
  onClickMenuItemOperation(menuItem: MenuItemInterface): void {

    // Parent
    super.onClickMenuItemOperation(menuItem);

    this
      .modelsSelected$
      .pipe(take(1))
      .subscribe(leads => {

        // Operations that trigger instantly
        switch (menuItem.id) {

          case OperationEnum.leadSendEmail:
            this.leadService.sendEmail(leads);
            break;
        }

        // Operation with subform
        if (this.operationSubform.indexOf(menuItem.id) > -1) {

          return;
        }

        // Reset current operation
        this.resetOperation();
      });
  }

  /**
   * Submitted modal for operation: modify status
   */
  onSubmitModalModifyStatus(event: ModalChoiceInterface<LeadModifyStatusInterface>): void {

    // Reset current operation
    this.resetOperation();

    // User cancelled
    if (event.isValid === false) {

      return;
    }

    this.leadService.modifyStatus(event.data);
  }
}
