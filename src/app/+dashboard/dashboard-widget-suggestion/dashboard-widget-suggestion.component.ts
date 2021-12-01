import { Component, OnDestroy, OnInit } from '@angular/core';

import { SuggestionModel } from '../../shared/model/suggestion.model';
import { SuggestionService } from '../../core/shared/suggestion/suggestion.service';
import { Subscription } from 'rxjs';
import { ModelListInterface } from '../../shared/interface/model-list.interface';
import { OrderEnum } from '../../shared/enum/order.enum';
import { SuggestionSearchModel } from '../../shared/model/suggestion-search.model';

@Component({
  selector: 'app-dashboard-widget-suggestion',
  templateUrl: './dashboard-widget-suggestion.component.html',
  styleUrls: ['./dashboard-widget-suggestion.component.scss'],
})
export class DashboardWidgetSuggestionComponent implements OnInit, OnDestroy {

  /**
   * Suggestions
   */
  suggestions: SuggestionModel[]|null = null;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private suggestionService: SuggestionService,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.subscriptions.push(
      this
        .suggestionService
        .list(
          {
            page: 1,
            perPage: 4,
          },
          {
            id: 'pertinence',
            order: OrderEnum.desc,
          },
          new SuggestionSearchModel(),
        )
        .subscribe(suggestionList => this.onNextSuggestionList(suggestionList)),
    );
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Next suggestion list
   */
  onNextSuggestionList(suggestionList: ModelListInterface<SuggestionModel>): void {

    this.suggestions = suggestionList.models;
  }
}
