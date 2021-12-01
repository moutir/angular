import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { SuggestionModel } from '../../shared/model/suggestion.model';
import { SuggestionOptionsInterface } from '../../shared/interface/suggestion-options.interface';
import { SuggestionModelAdapterStrategy } from '../../core/shared/suggestion/suggestion-model-adapter.strategy';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { OptionInterface } from '../../shared/interface/option.interface';
import { SuggestionTagModel } from '../../shared/model/suggestion-tag.model';
import { LanguageEnum } from '../../shared/enum/language.enum';

@Component({
  selector: 'app-suggestion-form-required',
  templateUrl: './suggestion-form-required.component.html',
  styleUrls: ['./suggestion-form-required.component.scss'],
})
export class SuggestionFormRequiredComponent extends FormComponentAbstract<
  SuggestionModel,
  SuggestionOptionsInterface
> implements OnChanges {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_CONTACT: EntityEnum[] = [EntityEnum.suggestionTag];

  /**
   * Languages to generate content for
   */
  @Input() languages: LanguageEnum[] = [];

  /**
   * List of selected tags
   */
  tagsSelection: OptionInterface[] = [];

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: SuggestionModelAdapterStrategy,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Clicked on a complexity button
   */
  onClickButtonComplexity(event: MouseEvent, complexity: number): void {

    // Prevent propagation of click event
    event.stopPropagation();

    if (this.isLoading === true) {

      return;
    }

    this.setValue('complexity', complexity);
  }

  /**
   * Changed selection of tags
   */
  onChangeSelectionTags(options: OptionInterface[]): void {

    const tags = options.map(option => {

      const tag = new SuggestionTagModel();
      tag.id = option.value;
      tag.name = option.text;

      return tag;
    });

    this.setValue('tags', tags);
  }

  /**
   * @inheritDoc
   */
  protected initialize(): boolean {

    if (super.initialize() === false) {

      return false;
    }

    const formArrayConfig = this.modelAdapterStrategy.getFormControlConfig(this.model)['contents'].formArrayConfig;
    const modelLanguages = this.model.contents.map(content => content.language);
    const missingLanguages = this.languages.filter(language => modelLanguages.indexOf(language) === -1);

    let i = this.model.contents.length;

    // For each missing language
    missingLanguages.forEach(missingLanguage => {

      // Add control to form array
      formArrayConfig.language.value = missingLanguage;
      this.addFormArrayChild(this.formArray['contents'].control, 'contents', i, formArrayConfig);

      i++;
    });

    return true;
  }

  /**
   * @inheritDoc
   */
  protected updateControls(): void {

    super.updateControls();

    // Update tags selection
    this.tagsSelection = this.model.tags.map(tag => {

      return {
        value: tag.id,
        text: tag.name,
      };
    });
  }
}
