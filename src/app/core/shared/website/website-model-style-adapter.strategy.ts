import { Injectable } from '@angular/core';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { WebsiteModel } from '../../../shared/model/website.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { colorValidator } from '../../../shared/validator/color.validator';
import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';

@Injectable()
export class WebsiteModelStyleAdapterStrategy extends FormModelAdapterStrategy<WebsiteModel> {

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: WebsiteModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      styleSiteBgColour: {
        value: model.styleSiteBgColour,
        validators: [colorValidator()],
      },
      styleBlockBgColour: {
        value: model.styleBlockBgColour,
        validators: [colorValidator()],
      },
      stylePrimaryBgColour: {
        value: model.stylePrimaryBgColour,
        validators: [colorValidator()],
      },
      stylePrimaryBgFlatColour: {
        value: model.stylePrimaryBgFlatColour,
        validators: [colorValidator()],
      },
      styleSecondaryBgColour: {
        value: model.styleSecondaryBgColour,
        validators: [colorValidator()],
      },
      styleFooterBgColour: {
        value: model.styleFooterBgColour,
        validators: [colorValidator()],
      },
      stylePrimaryFontColour: {
        value: model.stylePrimaryFontColour,
        validators: [colorValidator()],
      },
      styleSecondaryFontColour: {
        value: model.styleSecondaryFontColour,
        validators: [colorValidator()],
      },
      styleHeaderFooterFontColour: {
        value: model.styleHeaderFooterFontColour,
        validators: [colorValidator()],
      },
      styleDetailsTitleBgColour: {
        value: model.styleDetailsTitleBgColour,
        validators: [colorValidator()],
      },
      styleDetailsTitleBgShadowColour: {
        value: model.styleDetailsTitleBgShadowColour,
        validators: [colorValidator()],
      },
      styleDetailsAmenitiesFontColour: {
        value: model.styleDetailsAmenitiesFontColour,
        validators: [colorValidator()],
      },
      styleDetailsTopBarColour: {
        value: model.styleDetailsTopBarColour,
        validators: [colorValidator()],
      },
    };
  }
}
