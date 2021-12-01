import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { WebsiteArticleModel } from '../../../shared/model/website-article.model';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { WebsiteContentModel } from '../../../shared/model/website-content.model';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class WebsiteArticleModelContentAdapterStrategy extends FormModelAdapterStrategy<WebsiteArticleModel> {

  /**
   * Language of the content to use
   */
  private language: LanguageEnum|null = null;

  /**
   * Clone adapter strategy for a specific language usage
   */
  clone(language: LanguageEnum): WebsiteArticleModelContentAdapterStrategy {

    const clone = new WebsiteArticleModelContentAdapterStrategy();
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
  getFormControlConfig(model: WebsiteArticleModel): KeyValueType<string, FormControlConfigInterface> {

    const formControlConfig = {};
    const content = model.content[this.language] || new WebsiteContentModel();

    // Generate unique field names from field UID
    Object
      .keys(content)
      .forEach(field => {

        formControlConfig[this.getFieldUid(field)] = {
          value: content[field],
          validators: [],
        };

        if (field === 'description') {

          formControlConfig[this.getFieldUid(field)].updateOn = 'blur';
        }
      });

    return formControlConfig;
  }

  /**
   * @inheritDoc
   */
  getModel(
    model: WebsiteArticleModel,
    formGroup: FormGroup,
    key: string,
    value: string|string[]|Date|boolean|null|number|ModelAbstract|ModelAbstract[],
  ): WebsiteArticleModel {

    // Clone model
    const newModel = model.clone<WebsiteArticleModel>();

    // Define content
    newModel.content = {};

    // For each model's content
    Object
      .keys(model.content)
      .forEach(language => {

        // Instantiate content
        newModel.content[language] = new WebsiteContentModel();

        // Clone content
        Object
          .keys(model.content[language])
          .forEach(field => newModel.content[language][field] = model.content[language][field]);
      });

    // Missing current language content
    if (!newModel.content[this.language]) {

      newModel.content[this.language] = new WebsiteContentModel();
    }

    // Update content field
    const contentField = key.match(/^content_([a-zA-Z]+)_[a-z]{2}$/);

    if (contentField !== null && contentField.length === 2) {

      newModel.content[this.language][contentField[1]] = value;
    }

    return newModel;
  }

  /**
   * @inheritDoc
   */
  validate(model: WebsiteArticleModel, currentError: Dictionary<string|null>): null|Dictionary<string|null> {

    const error: Dictionary<string> = {};
    const content = model.content[this.language] || new WebsiteContentModel();
    const requiredFields = ['title', 'description'];

    // For each field in this language
    Object.keys(content).forEach(field => {

      // Reset error
      error[this.getFieldUid(field)] = null;
    });

    // If at least one content field has a value in this language
    if (Object.keys(content).some(field => !!content[field])) {

      // For each required field in this language
      requiredFields.forEach(field => {

        error[this.getFieldUid(field)] = !!content[field] ? null : 'required';
      });
    }

    // Has errors
    if (Object.keys(error).some(field => !!error[field])) {

      return error;
    }

    // At least one language has one field with a value
    const hasContent = Object
      .keys(model.content)
      .some(language => {

        return Object
          .keys(model.content[language])
          .some(field => !!model.content[language][field]);
      });

    // Has no content
    if (hasContent === false) {

      // Make required fields of this language as error
      requiredFields.forEach(field => error[this.getFieldUid(field)] = 'required_at_least_one_language');
    }

    return error;
  }

  /**
   * Return a field UID
   */
  getFieldUid(field: string): string {

    return ['content', field, this.language].join('_');
  }
}
