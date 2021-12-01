import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { ContactModel } from '../../shared/model/contact.model';
import { ContactSearchOptionsInterface } from '../../shared/interface/contact-search-options.interface';
import { ContactSearchModel } from '../../shared/model/contact-search.model';
import { ContactSearchlistService } from '../../core/shared/contact/contact-searchlist.service';
import { HistoryModel } from '../../shared/model/history.model';
import { HistoryInterface } from '../../shared/interface/history.interface';
import { HistoryService } from '../../core/shared/history/history.service';
import { ModalChoiceInterface } from '../../shared/interface/modal-choice.interface';
import { MenuItemInterface } from '../../shared/interface/menu-item.interface';
import { OperationEnum } from '../../shared/enum/operation.enum';
import { InputFormInterface } from '../../shared/interface/input-form.interface';
import { ContactTransferInterface } from '../../shared/interface/contact-transfer.interface';
import { ContactTransferOptionsInterface } from '../../shared/interface/contact-transfer-options.interface';
import { ContactModifyBrokerInterface } from '../../shared/interface/contact-modify-broker.interface';
import { ContactModifyBrokerOptionsInterface } from '../../shared/interface/contact-modify-broker-options.interface';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { TrackerService } from '../../core/shared/tracker/tracker.service';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { ContactService } from '../../core/shared/contact/contact.service';
import { ContactConfig } from '../../core/shared/contact/contact.config';
import { ContactTransferActivityInterface } from '../../shared/interface/contact-transfer-activity.interface';
import { ContactTransferActivityOptionsInterface } from '../../shared/interface/contact-transfer-activity-options.interface';
import { SearchModel } from '../../shared/model/search.model';


@Component({
  selector: 'app-contact-searchlist',
  templateUrl: './contact-searchlist.component.html',
  styleUrls: ['./contact-searchlist.component.scss'],
})
export class ContactSearchlistComponent extends SearchlistComponentAbstract<
  ContactModel,
  ContactSearchModel,
  ContactSearchOptionsInterface
> {
  
  

  /**
   * Is user subscribed to beta performance
   */
  @Input() isBetaPerformance: boolean|null = null;

  /**
   * Display agency field
   */
  @Input() isDisplayedAgency: boolean = false;

  /**
   * Operation names
   */
  operationNameModifyBroker: string = OperationEnum.contactModifyBroker;
  operationNameTransfer: string = OperationEnum.contactTransferBroker;
  operationNameTransferActivity: string = OperationEnum.contactTransferActivity;

  /**
   * State observables
   */
  runtimeFeature$: Observable<RuntimeFeatureInterface>;
  runtimePermissions$: Observable<PermissionEnum[]>;
  contactHistory$: Observable<HistoryInterface>;
  historyModels$: Observable<HistoryModel[]>;
  contactTransfer$: Observable<ContactTransferInterface>;
  contactTransferOptions$: Observable<ContactTransferOptionsInterface>;
  contactModifyBroker$: Observable<ContactModifyBrokerInterface>;
  contactModifyBrokerOptions$: Observable<ContactModifyBrokerOptionsInterface>;
  contactTransferActivity$: Observable<ContactTransferActivityInterface>;
  contactTransferActivityOptions$: Observable<ContactTransferActivityOptionsInterface>;
  filters$: Observable<ContactSearchModel>;

  /**
   * List of operation names that have a subform
   */
  private operationSubform: string[] = [
    OperationEnum.contactModifyBroker,
    OperationEnum.contactTransferBroker,
    OperationEnum.contactTransferActivity,
  ];

 

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: ContactConfig,
    protected searchlistService: ContactSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected trackerService: TrackerService,
    protected contactService: ContactService,
    protected historyService: HistoryService,
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

    this.runtimePermissions$ = this.runtimeService.selectPermissions();
    this.runtimeFeature$ = this.runtimeService.selectFeature();
    this.contactHistory$ = this.historyService.selectHistory();
    this.historyModels$ = this.historyService.selectHistoryModels();
    this.contactTransfer$ = this.contactService.selectTransfer();
    this.contactTransferOptions$ = this.contactService.selectTransferOptions();
    this.contactModifyBroker$ = this.contactService.selectModifyBroker();
    this.contactModifyBrokerOptions$ = this.contactService.selectModifyBrokerOptions();
    this.contactTransferActivity$ = this.contactService.selectTransferActivity();
    this.contactTransferActivityOptions$ = this.contactService.selectTransferActivityOptions();
    this.filters$ = this.searchlistService.selectFilters(this.uid);
    //console.log("link",this.uid)
   
  }

  /**
   * @inheritDoc
   */
  onClickMenuItemOperation(menuItem: MenuItemInterface): void {

    // Parent
    super.onClickMenuItemOperation(menuItem);

    this
      .selection$
      .pipe(take(1))
      .subscribe(selection => {
        
        // Operations that trigger instantly
        switch (menuItem.id) {
       
          case OperationEnum.contactAddBasket:
            //console.log(selection.ids);
            //console.log(menuItem.id);
            localStorage.setItem("contactIds", JSON.stringify(selection.ids)); 
            var contactME = JSON.parse(localStorage.getItem("contactIds"));
            // console.log("localstorage",contactME);
             this.contactService.addBasket(contactME);
            break;

          case OperationEnum.contactRemoveBasket:
            this.contactService.removeBasket(selection.ids);
            break;

          case OperationEnum.contactArchive:
            this.contactService.archive(selection.ids);
            break;

          case OperationEnum.contactSendEmail:
            this.contactService.sendEmail(selection.ids);
            break;

          case OperationEnum.contactUnarchive:
            this.contactService.unarchive(selection.ids);
            break;

          case OperationEnum.contactExportFull:
            this.contactService.export(selection.ids, 'full');
            break;

          case OperationEnum.contactExportSummary:
            this.contactService.export(selection.ids, 'summary');
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
   * Changed input in modal for operation: transfer
   */
  onChangeInputTransfer(input: InputFormInterface): void {

    this.contactService.updateTransferInput(input);
  }


  /**
   * Submitted modal for operation: transfer
   */
  onSubmitModalTransfer(event: ModalChoiceInterface<ContactTransferInterface>): void {

    // Reset current operation
    this.resetOperation();

    // User cancelled
    if (event.isValid === false) {

      return;
    }

    this.contactService.transfer(event.data);
  }

  /**
   * Submitted modal for operation: modify broker
   */
  onSubmitModalModifyBroker(event: ModalChoiceInterface<ContactModifyBrokerInterface>): void {

    // Reset current operation
    this.resetOperation();

    // User cancelled
    if (event.isValid === false) {

      return;
    }

    this.contactService.modifyBroker(event.data);
  }

  /**
   * Submitted modal for operation: transfer activity
   */
  onSubmitModalTransferActivity(event: ModalChoiceInterface<ContactTransferActivityInterface>): void {

    // Reset current operation
    this.resetOperation();

    // User cancelled
    if (event.isValid === false) {

      return;
    }

    this.contactService.transferActivity(event.data);
  }

  /**
   * Submitted history modal
   */
  onSubmitModalHistory(event: ModalChoiceInterface<HistoryInterface>): void {

    // User cancelled
    if (event.isValid === false) {

      this.historyService.closeModal();

      return;
    }
  }

  /**
   * @inheritDoc
   */
  onClickModel(model: ContactModel): void {

    // Nothing happens for a blacklisted contact
    if (model.isBlacklisted === true) {

      return;
    }

    this.contactService.page(model.id, model.fullName);
  }

  /**
   * Clicked a search
   */
  onClickSearchModel(event: { contact: ContactModel; search: SearchModel; }): void {

    // Nothing happens for a blacklisted contact
    if (event.contact.isBlacklisted === true) {

      return;
    }

    this.contactService.pageSearches(event.contact.id, event.search ? event.search.id : null);
  }
}
