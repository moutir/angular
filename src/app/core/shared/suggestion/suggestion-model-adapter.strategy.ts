import { Validators } from '@angular/forms';
import { Injectable } from '@angular/core';

import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { SuggestionModel } from '../../../shared/model/suggestion.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { SuggestionImageModel } from '../../../shared/model/suggestion-image.model';
import { ifIsNotRemoved } from '../../../shared/validator/if-is-not-removed.validator';
import { FormArrayModelConfigInterface } from '../../../shared/interface/form-array-model-config.interface';
import { arrayMinLengthValidator } from '../../../shared/validator/array-min-length.validator';
import { SuggestionContentModel } from '../../../shared/model/suggestion-content.model';

@Injectable()
export class SuggestionModelAdapterStrategy extends FormModelAdapterStrategy<SuggestionModel> {

  /**
   * @inheritDoc
   */
  readonly FORM_ARRAY_MODEL_CONFIG: KeyValueType<string, FormArrayModelConfigInterface> = {
    images: {
      factory: (): ModelAbstract => new SuggestionImageModel(),
    },
    contents: {
      factory: (): ModelAbstract => new SuggestionContentModel(),
    },
  };

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: SuggestionModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      clientBenefit: {
        value: model.clientBenefit,
        validators: [Validators.required],
      },
      realforceBenefit: {
        value: model.realforceBenefit,
        validators: [Validators.required],
      },
      complexity: {
        value: model.complexity,
        validators: [Validators.required],
      },
      statusId: {
        value: model.statusId,
        validators: [Validators.required],
      },
      isMarketable: {
        value: model.isMarketable,
        validators: [Validators.required],
      },
      isPublished: {
        value: model.isPublished,
        validators: [Validators.required],
      },
      tags: {
        value: model.tags,
        validators: [arrayMinLengthValidator(1)],
      },
      images: {
        value: model.images.map(imageModel => {

          return {
            isRemoved: imageModel.isRemoved,
            url: imageModel.url,
            label: imageModel.label,
          };
        }),
        validators: [],
        formArrayConfig: {
          isRemoved: {
            value: false,
            validators: [],
          },
          url: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required)],
          },
          label: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required)],
          },
        },
      },
      contents: {
        value: model.contents.map(contentModel => {

          return {
            isRemoved: contentModel.isRemoved,
            language: contentModel.language,
            title: contentModel.title,
            problem: contentModel.problem,
            solution: contentModel.solution,
            isComputerTranslated: contentModel.isComputerTranslated,
          };
        }),
        validators: [arrayMinLengthValidator(4)],
        formArrayConfig: {
          isRemoved: {
            value: false,
            validators: [],
          },
          language: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required)],
          },
          title: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required)],
          },
          problem: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required)],
          },
          solution: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required)],
          },
          isComputerTranslated: {
            value: true,
            validators: [ifIsNotRemoved(Validators.required)],
          },
        },
      },
    };
  }
}
