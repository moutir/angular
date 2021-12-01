import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dictionary } from 'app/shared/class/dictionary';
import { combineLatest, Observable, of } from 'rxjs';

import { SuggestionModel } from '../../shared/model/suggestion.model';
import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { SuggestionPageService } from '../../core/shared/suggestion/suggestion-page.service';
import { SuggestionOptionsInterface } from '../../shared/interface/suggestion-options.interface';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-suggestion-page-write',
  templateUrl: './suggestion-page-write.component.html',
  styleUrls: ['./suggestion-page-write.component.scss'],
})
export class SuggestionPageWriteComponent extends PageWriteComponentAbstract<SuggestionModel, SuggestionOptionsInterface> {

  /**
   * Constants
   */
  readonly PAGE_TAB_REQUIRED: PageTabEnum = PageTabEnum.suggestionWriteRequired;

  /**
   * State observables
   */
  availableLanguageIds$: Observable<LanguageEnum[]>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: SuggestionPageService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    private runtimeService: RuntimeService,
  ) {

    super(
      pageService,
      formService,
      activatedRoute,
    );
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.availableLanguageIds$ = this.runtimeService.selectAvailableLanguageIds();

    // Page is loading if "is loading" or "no available languages yet"
    this.isLoading$ = this.isLoading$.pipe(
      switchMap(isLoading => combineLatest([
        of(isLoading),
        this.availableLanguageIds$,
      ])),
      map(([isLoading, availableLanguageIds]) => isLoading || availableLanguageIds.length === 0),
    );
  }

  /**
   * @inheritDoc
   */
  protected getFieldTabMapping(): Dictionary<PageTabEnum> {

    const fieldTabMapping: Dictionary<PageTabEnum> = {};
    const model = new SuggestionModel();

    // TODO[nico] Replace by logic "all form's attribute" (search for it)
    Object
      .keys(model)
      .forEach(field => fieldTabMapping[field] = PageTabEnum.suggestionWriteRequired);

    return fieldTabMapping;
  }
}
