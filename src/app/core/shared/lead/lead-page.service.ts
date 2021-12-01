import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { LeadConfig } from './lead.config';
import { LeadModel } from '../../../shared/model/lead.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { LeadService } from './lead.service';
import { LeadOptionsInterface } from '../../../shared/interface/lead-options.interface';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { Dictionary } from '../../../shared/class/dictionary';
import { MenuInterface } from '../../../shared/interface/menu.interface';
import { selectUiType } from '../../../core-store/ui-page/selectors';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { MenuItemInterface } from '../../../shared/interface/menu-item.interface';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { OperationEnum } from '../../../shared/enum/operation.enum';
import { selectDataSubSourceBySource } from '../../../core-store/data-lead/selectors';
import { selectUiBrokerOptions } from '../../../core-store/ui-contact/selectors';
import { PageHeaderInterface } from '../../../shared/interface/page-header.interface';
import { ButtonTypeEnum } from '../../../shared/enum/button-type.enum';
import { PageActionEnum } from '../../../shared/enum/page-action.enum';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';

@Injectable()
export class LeadPageService extends PageServiceAbstract<LeadModel, LeadOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: LeadConfig,
    protected modelService: LeadService,
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
   * Return the email action tooltip's translation key
   */
  getEmailActionTooltip(model: LeadModel): string {

    if (model.isNeedValidation === true) {

      return 'label_required_contact_validation';
    }

    if (model.hasEmail === false) {

      return 'label_lead_no_email';
    }

    if (model.hasEmailStatus === false) {

      return 'label_lead_no_email_status';
    }

    if (model.hasEmailPrivilege === false) {

      return 'label_lead_no_email_privilege';
    }

    return 'label_email_send';
  }

  /**
   * @inheritDoc
   */
  selectHeader(): Observable<PageHeaderInterface> {

    return combineLatest(
      this.selectType(),
      this.selectAction(),
      super.selectHeader(),
      this.modelService.selectIsActiveValidation(),
    ).pipe(
      map(([pageType, action, header, isActiveValidation]) => {

        if (pageType !== PageTypeEnum.write || action === PageActionEnum.loading) {

          return header;
        }

        const buttonsDisabled = header.buttonsDisabled.filter(button => button !== ButtonTypeEnum.save);

        // Disable save button if contact validation active
        header.buttonsDisabled = isActiveValidation ? [ ...buttonsDisabled, ButtonTypeEnum.save ] : buttonsDisabled;

        return header;
      }),
    );
  }

  /**
   * @inheritDoc
   */
  selectTabUids(): Observable<PageTabEnum[]> {

    return this.store$.select(createSelector(
      selectUiType,
      this.getSelectorModel(),
      (
        type: PageTypeEnum,
        model: LeadModel,
      ) => {

        if (type === PageTypeEnum.read) {

          const tabs = this.getReadTabUids().slice(0);
          const index = tabs.indexOf(PageTabEnum.leadReadEmail);

          if (!model.originalMessage && !model.leadParserErrorCode && index > -1) {

            tabs.splice(index, 1);
          }

          return tabs;
        }

        if (type === PageTypeEnum.write) {

          return this.getWriteTabUids();
        }

        return [];
      },
    ));
  }

  /**
   * @inheritDoc
   */
  protected getModelPageTitle(model: LeadModel, language: LanguageEnum): string {

    const contactName = (model.contact.fullName || '').split(' - ')[0];
    const property = model.getProperty();
    const promotion = model.getPromotion();
    const reference = ((property && property.reference) || (promotion && promotion.reference) || '').split(' - ')[0];

    return [contactName, model.typeLabel, reference].filter(Boolean).join(' - ') || super.getModelPageTitle(model, language);
  }

  /**
   * @inheritDoc
   */
  protected getSelectorOptions(): MemoizedSelector<StateInterface, LeadOptionsInterface> {

    return createSelector(
      this.getSelectorModel(),
      this.runtimeService.getSelectorOptions(),
      selectDataPermissions,
      selectDataSubSourceBySource,
      selectUiBrokerOptions,
      (
        model: LeadModel,
        options: RuntimeOptionsInterface,
        permissions: PermissionEnum[],
        subSourceById: Dictionary<OptionInterface[]>,
        brokerOptions: OptionInterface[],
      ): LeadOptionsInterface => {

        return <LeadOptionsInterface>{
          type: options.leadType,
          status: options.leadStatus,
          source: options.leadSource,
          subSource: subSourceById[model.sourceId] || [],
          media: options.media,
          broker: permissions.indexOf(PermissionEnum.contactRead) > -1 ? brokerOptions : [],
        };
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorMenu(): MemoizedSelector<StateInterface, MenuInterface> {

    return createSelector(
      selectUiType,
      selectDataPermissions,
      this.getSelectorModel(),
      (
        type: PageTypeEnum,
        permissions: PermissionEnum[],
        model: LeadModel,
      ): MenuInterface => {

        const items: MenuItemInterface[] = [];

        // Read page with write permission
        if (type === PageTypeEnum.read && permissions.indexOf(this.moduleConfig.PERMISSION_WRITE) > -1) {

          if (permissions.indexOf(PermissionEnum.mailboxWrite) > -1) {

            const tooltip = this.getEmailActionTooltip(model);

            // Send email
            items.push({
              id: OperationEnum.leadSendEmail,
              label: 'label_email_send',
              isEnabled: model.isAllowedEmail === true,
              icon: 'email',
              tooltip: tooltip === 'label_email_send' ? '' : tooltip,
              items: [],
            });
          }
        }

        return { items };
      },
    );
  }
}
