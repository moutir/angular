import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { WebsiteArticleModel } from '../../../shared/model/website-article.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';

@Injectable()
export class WebsiteArticleModelGeneralAdapterStrategy extends FormModelAdapterStrategy<WebsiteArticleModel> {

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: WebsiteArticleModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      websiteId: {
        value: model.websiteId,
        validators: [Validators.required],
      },
      author: {
        value: model.author,
        validators: [],
      },
      creationDate: {
        value: model.creationDate,
        validators: [],
      },
      isPublished: {
        value: model.isPublished,
        validators: [],
      },
    };
  }
}
