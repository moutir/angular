import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ProductionTypeEnum } from '../../../shared/enum/production-type.enum';
import { FormArrayModelConfigInterface } from '../../../shared/interface/form-array-model-config.interface';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { ProductionContactModel } from '../../../shared/model/production-contact.model';
import { ProductionModel } from '../../../shared/model/production.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';

@Injectable()
export class ProductionModelTypeAdapterStrategy extends FormModelAdapterStrategy<ProductionModel> {

  /**
   * @inheritDoc
   */
  readonly FORM_ARRAY_MODEL_CONFIG: KeyValueType<string, FormArrayModelConfigInterface> = {
    contacts: {
      factory: (): ProductionContactModel => new ProductionContactModel(),
    },
  };

  /**
   * Production type to use
   */
  private type: ProductionTypeEnum|null = null;

  /**
   * Clone adapter strategy for a specific type usage
   */
  clone(type: ProductionTypeEnum): ProductionModelTypeAdapterStrategy {

    const clone = new ProductionModelTypeAdapterStrategy();
    clone.setType(type);

    return clone;
  }

  /**
   * Set production type
   */
  setType(type: ProductionTypeEnum): void {

    this.type = type;
  }

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: ProductionModel): KeyValueType<string, FormControlConfigInterface> {

    const formControlConfig: KeyValueType<string, FormControlConfigInterface> = {};
    const fields = ['date'];

    // Generate unique field names from field UID
    fields.forEach(field => {

      let key = field;

      if (field === 'date') {

        key = this.type + 'Date';
      }

      formControlConfig[this.getFieldUid(field)] = {
        value: model[key],
        validators: [],
        updateOn: 'change',
      };
    });

    formControlConfig.contacts = {
      value: (model.contactsByType[this.type] || []).map(contactModel => {

        return {
          isRemoved: false,
          commissionRental: contactModel.commissionRental,
          commissionSales: contactModel.commissionSales,
          dealRental: contactModel.dealRental,
          dealSales: contactModel.dealSales,
          expenseRental: contactModel.expenseRental,
          expenseSales: contactModel.expenseSales,
          productionRental: contactModel.productionRental,
          productionSales: contactModel.productionSales,
          salaryRental: contactModel.salaryRental,
          salarySales: contactModel.salarySales,
          targetRental: contactModel.targetRental,
          targetSales: contactModel.targetSales,
        };
      }),
      validators: [],
      formArrayConfig: {
        isRemoved: {
          value: false,
          validators: [],
        },
        commissionRental: {
          value: '',
          validators: [],
        },
        commissionSales: {
          value: '',
          validators: [],
        },
        dealRental:  {
          value: '',
          validators: [],
        },
        dealSales:  {
          value: '',
          validators: [],
        },
        expenseRental:  {
          value: '',
          validators: [],
        },
        expenseSales:  {
          value: '',
          validators: [],
        },
        productionRental:  {
          value: '',
          validators: [],
        },
        productionSales:  {
          value: '',
          validators: [],
        },
        salaryRental:  {
          value: '',
          validators: [],
        },
        salarySales:  {
          value: '',
          validators: [],
        },
        targetRental:  {
          value: '',
          validators: [],
        },
        targetSales:  {
          value: '',
          validators: [],
        },
      },
    };

    return formControlConfig;
  }

  /**
   * @inheritDoc
   */
  getModel(model: ProductionModel, formGroup: FormGroup, path: string, value: Object|Object[]): ProductionModel {

    const newModel = super.getModel(model, formGroup, path, value);

    // Update type field
    const typeField = path.match(/^type_([a-zA-Z]+)_[a-zA-Z]/);

    if (typeField !== null && typeField[1] === 'date') {

      newModel[this.type + 'Date'] = value;
    }

    if (path === 'contacts') {

      // Set model attribute from value
      newModel.contactsByType[this.type] = (<Object[]>value).map((obj, i) => {

        // Use cloned model or instantiate a new one
        const rowModel: ProductionContactModel = <ProductionContactModel>(newModel.contactsByType[this.type][i] ?
          newModel.contactsByType[this.type][i].clone() : this.FORM_ARRAY_MODEL_CONFIG[path].factory());

        // Copy attributes from object to model
        Object.keys(obj).forEach(rowAttribute => rowModel[rowAttribute] = obj[rowAttribute]);

        // Is new
        rowModel.isNew = rowModel.isNew || !rowModel.id;

        return rowModel;
      });
    }

    return newModel;
  }

  /**
   * Return a field UID
   */
  getFieldUid(field: string): string {

    return ['type', field, this.type].join('_');
  }
}
