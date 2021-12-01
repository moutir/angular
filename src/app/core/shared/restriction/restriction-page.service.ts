import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { RestrictionConfig } from './restriction.config';
import { RestrictionModel } from '../../../shared/model/restriction.model';
import { RestrictionOptionsInterface } from '../../../shared/interface/restriction-options.interface';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { RestrictionService } from './restriction.service';
import { MenuInterface } from '../../../shared/interface/menu.interface';
import { selectUiType } from '../../../core-store/ui-page/selectors';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { MenuItemInterface } from '../../../shared/interface/menu-item.interface';
import { selectDataAuthentication, selectDataFeatureRestriction, selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { RuntimeFeatureRestrictionInterface } from '../../../shared/interface/runtime-feature-restriction.interface';
import { selectUiModules } from '../../../core-store/ui-restriction/selectors';
import { selectUiCustomAttributeOptions } from '../../../core-store/ui-custom-attribute/selectors';
import { CustomAttributeTypeEnum } from '../../../shared/enum/custom-attribute-type.enum';
import { OptionGroupInterface } from '../../../shared/interface/option-group.interface';
import { TranslateService } from '@ngx-translate/core';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { RuntimeAuthenticationInterface } from '../../../shared/interface/runtime-authentication.interface';

@Injectable()
export class RestrictionPageService extends PageServiceAbstract<RestrictionModel, RestrictionOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: RestrictionConfig,
    protected modelService: RestrictionService,
    private translateService: TranslateService,
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
  protected getModelPageTitle(model: RestrictionModel, language: LanguageEnum): string {

    return model.name || super.getModelPageTitle(model, language);
  }

  /**
   * @inheritDoc
   */
  protected getSelectorMenu(): MemoizedSelector<StateInterface, MenuInterface> {

    return createSelector(
      selectUiType,
      selectDataPermissions,
      this.getSelectorModel(),
      selectDataAuthentication,
      (
        type: PageTypeEnum,
        permissions: PermissionEnum[],
        model: RestrictionModel,
        authentication: RuntimeAuthenticationInterface,
      ): MenuInterface => {

        const items: MenuItemInterface[] = [];

        // Page read with write permission
        if (type === PageTypeEnum.read && this.isAllowedWriteModel(model, permissions, authentication)) {

          items.push({
            id: 'remove',
            label: 'label_remove',
            icon: 'delete_forever',
            tooltip: 'label_delete_forever',
            isEnabled: true,
            items: [],
          });
        }

        return { items };
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorOptions(): MemoizedSelector<StateInterface, RestrictionOptionsInterface> {

    return createSelector(
      selectDataFeatureRestriction,
      selectUiModules,
      this.runtimeService.getSelectorOptions(),
      selectUiCustomAttributeOptions(CustomAttributeTypeEnum.property),
      selectDataPermissions,
      selectDataAuthentication,
      (
        featureRestriction: RuntimeFeatureRestrictionInterface,
        modules: OptionInterface[],
        runtimeOptions: RuntimeOptionsInterface,
        customAttributePropertyOptions: OptionGroupInterface[],
        permissions: PermissionEnum[],
        authentication: RuntimeAuthenticationInterface,
      ) => {

        const options = {
          module: modules,
          attribute: {},
          operator: {},
          input: {},
          brokerTargets: permissions.indexOf(PermissionEnum.agencyGroupAdmin) > -1 ? [] : runtimeOptions.brokerColleague,
          brokerByAgencyTargets: permissions.indexOf(PermissionEnum.agencyGroupAdmin) > -1 ? runtimeOptions.brokerByAgency : [],
          agencyTargets: permissions.indexOf(PermissionEnum.agencyGroupAdmin) > -1 ?
            runtimeOptions.agencyRelated :
            runtimeOptions.agencyRelated.filter(option => option.value === authentication.agencyId),
          groupTargets: permissions.indexOf(PermissionEnum.agencyGroupAdmin) > -1 ? runtimeOptions.groupOfAgency : [],
          categoryIds: runtimeOptions.propertyCategory,
          transactionTypeIds: runtimeOptions.transactionType,
          contactSearchTransactionTypeIds: runtimeOptions.transaction,
          sectorIds: runtimeOptions.sector,
          customAttributeIds: customAttributePropertyOptions,
        };

        // For each modules
        Object
          .keys(featureRestriction.rules)
          .forEach(module => {

            // Attributes per module
            options.attribute[module] = [];
            options.operator[module] = {};
            options.input[module] = {};

            Object.keys(featureRestriction.rules[module]).forEach(attribute => {

              // Attribute (translated already for the purpose of sorting only)
              options.attribute[module].push({
                value: attribute,
                text: this.translateService.instant('label_restriction_attribute_' + attribute),
              });

              // Operator
              options.operator[module][attribute] = featureRestriction.rules[module][attribute].operators.map(operator => {

                return {
                  value: operator,
                  text: 'label_restriction_operator_' + operator,
                };
              });

              // Input
              options.input[module][attribute] = {
                value: featureRestriction.rules[module][attribute].formatter,
                text: 'label_restriction_input_placeholder_' + featureRestriction.rules[module][attribute].formatter,
              };
            });

            // Sort attributes
            options.attribute[module] = options.attribute[module].sort((optionA, optionB) => optionA.text.localeCompare(optionB.text));
          });

        return options;
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected isAllowedWriteModel(
    model: RestrictionModel,
    permissions: PermissionEnum[],
    authentication: RuntimeAuthenticationInterface,
  ): boolean {

    if (super.isAllowedWriteModel(model, permissions, authentication) === false) {

      return false;
    }

    // User is not "agency group admin" but his agency is not affected or other agencies than his are also affected
    if (
      permissions.indexOf(PermissionEnum.agencyGroupAdmin) === -1 &&
      (model.acl > 0 || model.affectedAgencyIds.indexOf(authentication.agencyId) === -1 || model.affectedAgencyIds.length > 1)
    ) {

      return false;
    }

    return true;
  }
}
