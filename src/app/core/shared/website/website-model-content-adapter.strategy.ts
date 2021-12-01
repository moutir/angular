import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { WebsiteModel } from '../../../shared/model/website.model';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { WebsiteContentModel } from '../../../shared/model/website-content.model';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';

@Injectable()
export class WebsiteModelContentAdapterStrategy extends FormModelAdapterStrategy<WebsiteModel> {

  /**
   * Language of the content to use
   */
  private language: LanguageEnum|null = null;

  /**
   * Clone adapter strategy for a specific language usage
   */
  clone(language: LanguageEnum): WebsiteModelContentAdapterStrategy {

    const clone = new WebsiteModelContentAdapterStrategy();
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
  getFormControlConfig(model: WebsiteModel): KeyValueType<string, FormControlConfigInterface> {

    const formControlConfig = {};
    const content = model.homePageContent[this.language] || new WebsiteContentModel();

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
    model: WebsiteModel,
    formGroup: FormGroup,
    key: string,
    value: string|string[]|Date|boolean|null|number|ModelAbstract|ModelAbstract[],
  ): WebsiteModel {

    // Clone model
    const newModel = model.clone<WebsiteModel>();

    // Define content
    newModel.homePageContent = {};

    // For each model's content
    Object
      .keys(model.homePageContent)
      .forEach(language => {

        // Instantiate content
        newModel.homePageContent[language] = new WebsiteContentModel();

        // Clone content
        Object
          .keys(model.homePageContent[language])
          .forEach(field => newModel.homePageContent[language][field] = model.homePageContent[language][field]);
      });

    // Missing current language content
    if (!newModel.homePageContent[this.language]) {

      newModel.homePageContent[this.language] = new WebsiteContentModel();
    }

    // Update content field
    const contentField = key.match(/^content_([a-zA-Z]+)_[a-z]{2}$/);

    if (contentField !== null && contentField.length === 2) {

      newModel.homePageContent[this.language][contentField[1]] = value;
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
