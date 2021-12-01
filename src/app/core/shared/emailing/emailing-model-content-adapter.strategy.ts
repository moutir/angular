import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { EmailingModel } from '../../../shared/model/emailing.model';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { EmailingContentModel } from '../../../shared/model/emailing-content.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class EmailingModelContentAdapterStrategy extends FormModelAdapterStrategy<EmailingModel> {

  /**
   * Language of the content to use
   */
  private language: LanguageEnum|null = null;

  /**
   * Clone adapter strategy for a specific language usage
   */
  clone(language: LanguageEnum): EmailingModelContentAdapterStrategy {

    const clone = new EmailingModelContentAdapterStrategy();
    clone.setLanguage(language);

    return clone;
  }

  /**
   * Sets language
   */
  setLanguage(language: LanguageEnum): void {

    this.language = language;
  }

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: EmailingModel): KeyValueType<string, FormControlConfigInterface> {

    const formControlConfig = {};
    const content = model.content[this.language] || new EmailingContentModel();

    // Generate unique field names from field UID
    Object
      .keys(content)
      .forEach(field => {

        formControlConfig[this.getFieldUid(field)] = {
          value: content[field],
          validators: [],
        };

        if (field === 'message') {

          formControlConfig[this.getFieldUid(field)].updateOn = 'blur';
        }
      });

    return formControlConfig;
  }

  /**
   * @inheritDoc
   */
  validate(model: EmailingModel): Dictionary<string|null> {

    const error: Dictionary<string> = {};
    const content = model.content[this.language] || new EmailingContentModel();
    const isContentDisabled = model.contactLanguages.indexOf(this.language) === -1;

    // For each field in this language
    Object.keys(content).forEach(field => {

      // Reset error
      error[this.getFieldUid(field)] = null;
    });

    // If language is not disabled OR at least one content field has a value in this language
    if (isContentDisabled === false || Object.keys(content).some(field => !!content[field])) {

      // For each field in this language
      Object.keys(content).forEach(field => {

        error[this.getFieldUid(field)] = !!content[field] ? null : 'required';
      });
    }

    // Has errors
    if (Object.keys(error).some(field => !!error[field])) {

      return error;
    }

    return error;
  }

  /**
   * @inheritDoc
   */
  getModel(
    model: EmailingModel,
    formGroup: FormGroup,
    path: string,
    value: string|string[]|Date|boolean|null|number|ModelAbstract|ModelAbstract[],
  ): EmailingModel {

    // Clone model
    const newModel = super.getModel(model, formGroup, path, value);

    // Define content
    newModel.content = {};

    // For each model's content
    Object
      .keys(model.content)
      .forEach(language => {

        // Instantiate content
        newModel.content[language] = new EmailingContentModel();

        // Clone content
        Object
          .keys(model.content[language])
          .forEach(field => newModel.content[language][field] = model.content[language][field]);
      });

    // Missing current language content
    if (!newModel.content[this.language]) {

      newModel.content[this.language] = new EmailingContentModel();
    }

    // Update content field
    const contentField = path.match(/^content_([a-z]+)_[a-z]{2}$/);

    if (contentField !== null && contentField.length === 2) {

      newModel.content[this.language][contentField[1]] = value;
    }

    return newModel;
  }

  /**
   * Return a field UID
   */
  getFieldUid(field: string): string {

    return ['content', field, this.language].join('_');
  }
}
