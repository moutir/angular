import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { ProductionConfig } from './production.config';
import { ProductionModel } from '../../../shared/model/production.model';
import { ProductionOptionsInterface } from '../../../shared/interface/production-options.interface';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ProductionService } from './production.service';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { selectDataByFrequency } from '../../../core-store/data-production/selectors';
import { ProductionFrequencyInterface } from '../../../shared/interface/production-frequency.interface';

@Injectable()
export class ProductionPageService extends PageServiceAbstract<ProductionModel, ProductionOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: ProductionConfig,
    protected modelService: ProductionService,
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
    if (type === PageTypeEnum.list) {

      this.router.navigate(['/agency']);
      return;
    }

    return super.redirect(type, id);
  }

  /**
   * @inheritDoc
   */
  setPage(type: PageTypeEnum, id: string|null): void {

    super.setPage(type, 'admin');
  }

  /**
   * @inheritDoc
   */
  protected getModelPageTitle(model: ProductionModel, language: LanguageEnum): string {

    return 'label_production';
  }

  /**
   * @inheritDoc
   */
  protected getSelectorOptions(): MemoizedSelector<StateInterface, ProductionOptionsInterface> {

    return createSelector(
      selectDataByFrequency,
      this.getSelectorModel(),
      (
        byFrequency: ProductionFrequencyInterface,
      ): ProductionOptionsInterface => {

        const optionsSaleMonth: OptionInterface[] = [];
        const optionsSaleYear: OptionInterface[] = [];
        const optionsRentalMonth: OptionInterface[] = [];
        const optionsRentalYear: OptionInterface[] = [];

        // Sale monthly
        Object.keys(byFrequency.saleMonthly).forEach(key => {

          const segments = key.split('_');

          optionsSaleMonth.push({
            value: key,
            text: [segments[0], this.getMonthLabel(Number(segments[1]))].join(' '),
          });
        });

        // Rental monthly
        Object.keys(byFrequency.rentalMonthly).forEach(key => {

          const segments = key.split('_');

          optionsRentalMonth.push({
            value: key,
            text: [segments[0], this.getMonthLabel(Number(segments[1]))].join(' '),
          });
        });

        // Sale yearly
        Object.keys(byFrequency.saleYearly).forEach(key => {

          optionsSaleYear.push({
            value: key,
            text: key,
          });
        });

        // Rental monthly
        Object.keys(byFrequency.rentalYearly).forEach(key => {

          optionsRentalYear.push({
            value: key,
            text: key,
          });
        });

        // Sort
        optionsSaleMonth.sort((a, b) => (a.value > b.value ? -1 : 1));
        optionsSaleYear.sort((a, b) => (a.value > b.value ? -1 : 1));
        optionsRentalMonth.sort((a, b) => (a.value > b.value ? -1 : 1));
        optionsRentalYear.sort((a, b) => (a.value > b.value ? -1 : 1));

        return {
          saleMonthly: optionsSaleMonth,
          saleYearly: optionsSaleYear,
          rentalMonthly: optionsRentalMonth,
          rentalYearly: optionsRentalYear,
        };
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorTitle(): MemoizedSelector<StateInterface, string> {

    return createSelector(
      selectDataPermissions,
      (permissions: PermissionEnum[]): string => {

        return 'label_my_agency';
      },
    );
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

        return ['label_production'];
      },
    );
  }

  /**
   * Return the month's label
   */
  private getMonthLabel(index: number): string {

    const month: string[] = this.translateService.instant('label_months').split(',').map(name => name.trim());

    return month[index - 1] || '';
  }
}
