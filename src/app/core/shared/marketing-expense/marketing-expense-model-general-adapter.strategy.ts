import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { MarketingExpenseModel } from '../../../shared/model/marketing-expense.model';
import { PropertyModel } from '../../../shared/model/property.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { requiredModelValidator } from '../../../shared/validator/required-model.validator';
import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { ifIsNotRemoved } from '../../../shared/validator/if-is-not-removed.validator';
import { FormArrayModelConfigInterface } from '../../../shared/interface/form-array-model-config.interface';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { MarketingExpensePropertyModel } from '../../../shared/model/marketing-expense-property.model';
import { MarketingExpensePromotionModel } from '../../../shared/model/marketing-expense-promotion.model';
import { PromotionModel } from '../../../shared/model/promotion.model';

@Injectable()
export class MarketingExpenseModelGeneralAdapterStrategy extends FormModelAdapterStrategy<MarketingExpenseModel> {

  /**
   * @inheritDoc
   */
  readonly FORM_ARRAY_MODEL_CONFIG: KeyValueType<string, FormArrayModelConfigInterface> = {
    properties: {
      factory: (): ModelAbstract => new MarketingExpensePropertyModel(),
    },
    promotions: {
      factory: (): ModelAbstract => new MarketingExpensePromotionModel(),
    },
  };

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: MarketingExpenseModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      title: {
        value: model.title,
        validators: [Validators.required],
      },
      invoiceDate: {
        value: model.invoiceDate,
        validators: [Validators.required],
      },
      invoiceAmount: {
        value: model.invoiceAmount,
        validators: [Validators.required],
      },
      mainCategoryId: {
        value: model.mainCategoryId,
        validators: [Validators.required],
      },
      subCategoryId: {
        value: model.subCategoryId,
        validators: [],
      },
      invoiceNumber: {
        value: model.invoiceNumber,
        validators: [],
      },
      startDate: {
        value: model.startDate,
        validators: [Validators.required],
      },
      endDate: {
        value: model.endDate,
        validators: [Validators.required],
      },
      properties: {
        value: model.properties.map(expensePropertyModel => {

          return {
            isRemoved: expensePropertyModel.isRemoved,
            property: expensePropertyModel.property,
            amount: expensePropertyModel.amount,
            title: expensePropertyModel.title,
          };
        }),
        validators: [],
        formArrayConfig: {
          isRemoved: {
            value: false,
            validators: [],
          },
          property: {
            value: new PropertyModel(),
            validators: [ifIsNotRemoved(requiredModelValidator)],
          },
          amount: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required)],
          },
          title: {
            value: '',
            validators: [],
          },
        },
      },
      promotions: {
        value: model.promotions.map(expensePromotionModel => {

          return {
            isRemoved: expensePromotionModel.isRemoved,
            promotion: expensePromotionModel.promotion,
            amount: expensePromotionModel.amount,
            title: expensePromotionModel.title,
          };
        }),
        validators: [],
        formArrayConfig: {
          isRemoved: {
            value: false,
            validators: [],
          },
          promotion: {
            value: new PromotionModel(),
            validators: [ifIsNotRemoved(requiredModelValidator)],
          },
          amount: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required)],
          },
          title: {
            value: '',
            validators: [],
          },
        },
      },
    };
  }
}
