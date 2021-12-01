import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Dictionary } from 'app/shared/class/dictionary';

import { ModelAbstract } from '../../../shared/class/model.abstract';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormArrayModelConfigInterface } from '../../../shared/interface/form-array-model-config.interface';

@Injectable()
export class FormModelAdapterStrategy<Model extends ModelAbstract> {

  /**
   * Form array attributes mapped to their model's factory
   */
  readonly FORM_ARRAY_MODEL_CONFIG: KeyValueType<string, FormArrayModelConfigInterface> = {};

  /**
   * Return form control config
   */
  getFormControlConfig(model: Model): KeyValueType<string, FormControlConfigInterface> {

    const controlConfig = {};

    Object
      .keys(model)
      .forEach(key => {

        // Create a default optional control
        controlConfig[key] = {
          value: model[key],
          validators: [],
        };
      });

    return controlConfig;
  }

  /**
   * Return a dictionary of "model attribute => validation error string".
   * For each error case, you need to set the value to null if the value is valid.
   * Return null if no custom validation is in place.
   */
  validate(model: Model, currentError: Dictionary<string|null>): null|Dictionary<string|null> {

    /**
     * Example:
     *
     * const error: Dictionary<string> = {};
     *
     * error.firstname = model.firstname === model.lastname ? 'same_as_lastname' : null;
     * error.lastname = model.firstname === model.lastname ? 'same_as_firstname' : null;
     *
     * return error;
     */

    return null;
  }

  /**
   * Return model based on current model, current form, and the latest updated input
   */
  getModel(model: Model, formGroup: FormGroup, path: string, value: Object|Object[]): Model {

    // Clone model
    const newModel = model.clone ? model.clone<Model>() : Object.assign<Model, Model>(Object.create(Object.getPrototypeOf(model)), model);

    // Path is a form array
    if (this.FORM_ARRAY_MODEL_CONFIG[path]) {

      // Set model attribute from value
      newModel[path] = (<Object[]>value).map((obj, i) => {

        // Use cloned model or instantiate a new one
        const rowModel = newModel[path][i] ? newModel[path][i].clone() : this.FORM_ARRAY_MODEL_CONFIG[path].factory();

        // Copy attributes from object to model
        Object.keys(obj).forEach(rowAttribute => rowModel[rowAttribute] = obj[rowAttribute]);

        // Is new
        rowModel.isNew = rowModel.isNew || !rowModel.id;

        return rowModel;
      });

      // Handle radio-checkbox attributes
      (this.FORM_ARRAY_MODEL_CONFIG[path].radioCheckboxes || []).forEach(attr => {

        let indexTrue: number|null = null;

        // Find record that is now true
        (<Object[]>value).some((val, i) => {

          // Is now true
          if (val[attr] === true && (model[path][i] && model[path][i][attr]) === false) {

            indexTrue = i;

            return true;
          }
        });

        // Found a new true
        if (indexTrue !== null) {

          // Set all values to false
          newModel[path].forEach((m, i) => newModel[path][i][attr] = false);

          // Set new value to true
          newModel[path][indexTrue][attr] = true;
        }

        // None active records have a selected value
        if (newModel[path].every(record => record.isRemoved === true || (record.isRemoved === false && record[attr] === false))) {

          // Set all values to false
          newModel[path].forEach((m, i) => newModel[path][i][attr] = false);

          // Set first active record as selected
          newModel[path].some((record, i) => {

            // Record is not removed
            if (record.isRemoved === false) {

              newModel[path][i][attr] = true;

              return true;
            }
          });
        }
      });

      return newModel;
    }

    // Set new model attribute's value
    newModel[path] = Array.isArray(value) ? value.slice(0) : value;

    return newModel;
  }
}
