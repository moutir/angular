import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material';
import { Chart } from 'angular-highcharts';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as Highcharts from 'highcharts';

import { SuggestionModel } from '../../shared/model/suggestion.model';
import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { SuggestionPageService } from '../../core/shared/suggestion/suggestion-page.service';
import { SuggestionOptionsInterface } from '../../shared/interface/suggestion-options.interface';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { GalleryImageInterface } from '../../shared/interface/gallery-image.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { SuggestionService } from '../../core/shared/suggestion/suggestion.service';
import { SuggestionVoteModel } from '../../shared/model/suggestion-vote.model';
import { SuggestionContentModel } from '../../shared/model/suggestion-content.model';
import { OptionInterface } from '../../shared/interface/option.interface';

@Component({
  selector: 'app-suggestion-page-read',
  templateUrl: './suggestion-page-read.component.html',
  styleUrls: ['./suggestion-page-read.component.scss'],
})
export class SuggestionPageReadComponent extends PageReadComponentAbstract<SuggestionModel, SuggestionOptionsInterface> implements OnInit {

  /**
   * Constants
   */
  readonly PAGE_TAB_INFORMATION: PageTabEnum = PageTabEnum.suggestionReadInformation;
  readonly PAGE_TAB_VOTE: PageTabEnum = PageTabEnum.suggestionReadVote;
  readonly PERMISSION_SUGGESTION_WRITE: PermissionEnum = PermissionEnum.suggestionWrite;
  readonly VOTE_ICON: string[] = [
    'mood_bad',
    'sentiment_very_dissatisfied',
    'flaky',
    'sentiment_satisfied_alt',
    'sentiment_very_satisfied',
  ];

  /**
   * State observables
   */
  runtimePermissions$: Observable<PermissionEnum[]>;
  options$: Observable<SuggestionOptionsInterface>;

  /**
   * Images
   */
  images: GalleryImageInterface[] = [];

  /**
   * Content in current language
   */
  content: SuggestionContentModel = new SuggestionContentModel();

  /**
   * Votes
   *
   * IMPORTANT: We do not keep votes in the model, nor in the store.
   * The votes are only used in this page's context, and it could be a large dataset, so let's not keep it in memory.
   */
  votes: null|SuggestionVoteModel[] = null;

  /**
   * Charts
   */
  charts: Chart[] = [];

  /**
   * Chart options
   */
  private chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      inverted: true,
    },
    title: null,
    xAxis: {
      type: 'category',
    },
    yAxis: {
      title: null,
      allowDecimals: false,
      min: 0,
      stackLabels: {
        enabled: true,
        style: {
          color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || 'black',
        },
      },
    },
    legend: {
      enabled: true,
    },
    exporting: {
      enabled: false,
    },
    tooltip: {
      headerFormat: '{series.name}',
      pointFormat: '',
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          formatter: function(): string {

            return this.point.y ? String(this.point.y) : '';
          },
        },
      },
    },
    series: [],
  };

  /**
   * Constructor
   */
  constructor(
    protected pageService: SuggestionPageService,
    protected activatedRoute: ActivatedRoute,
    private runtimeService: RuntimeService,
    private suggestionService: SuggestionService,
    private translateService: TranslateService,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }

  /**
   * @inheritDoc
   */
  onChangeTab(event: MatTabChangeEvent): void {

    super.onChangeTab(event);

    // Votes tab
    if (this.tabUids[event.index] === PageTabEnum.suggestionReadVote && this.model) {

      // Load suggestion's votes
      this.subscriptions.push(
        combineLatest([
          this.options$,
          this.suggestionService.listVote(this.model.id),
        ])
        .subscribe(([options, votes]) => this.onNextVotes(votes, options.accountTypeIds, options.suggestionVoteIds)),
      );
    }
  }

  /**
   * Clicked the vote button
   */
  onClickVote(voteId: string): void {

    if (!this.model || this.model.voteId === voteId) {

      return;
    }

    const vote = new SuggestionVoteModel();
    vote.vote = voteId;

    this.suggestionService.saveVote(this.model.id, vote);
  }

  /**
   * Next votes
   */
  onNextVotes(
    votes: SuggestionVoteModel[],
    accountTypeIds: OptionInterface[],
    suggestionVoteIds: OptionInterface[],
  ): void {

    // Update votes
    this.votes = votes;

    const barCountMax = 5;
    const defaultVotes = {};

    // Account type mapping
    const accountTypeMapping = {};
    accountTypeIds.forEach(accountType => accountTypeMapping[accountType.value] = accountType.text);

    // Suggestion vote mapping
    const suggestionVoteMapping = {};
    const suggestionVoteIndexMapping = {};
    suggestionVoteIds.forEach((suggestionVote, i) => {

      suggestionVoteMapping[suggestionVote.value] = suggestionVote.text;
      suggestionVoteIndexMapping[suggestionVote.value] = i;
      defaultVotes[suggestionVote.value] = 0;
    });

    const settings = [
      {
        getId: (vote) => vote.createContact.agency.id,
        getCategory: (vote) => vote.createContact.agency.name,
        mapping: {
          '0': {
            id: '0',
            name: this.translateService.instant('suggestion_agency_votes_other'),
            total: 0,
            votes: {
              ...defaultVotes,
            },
          },
        },
        categoryIds: [],
        series: [],
      },
      {
        getId: (vote) => vote.createAccountTypeId,
        getCategory: (vote) => accountTypeMapping[vote.createAccountTypeId] || 'unknown',
        mapping: {
          '0': {
            id: '0',
            name: this.translateService.instant('suggestion_account_votes_other'),
            total: 0,
            votes: {
              ...defaultVotes,
            },
          },
        },
        categoryIds: [],
        series: [],
      },
    ];

    votes.forEach(vote => {

      // Votes mapping (unsorted)
      settings.forEach((setting, i) => {

        const id = setting.getId(vote);

        if (!settings[i].mapping[id]) {

          settings[i].mapping[id] = {
            id: id,
            name: setting.getCategory(vote),
            total: 0,
            votes: {
              ...defaultVotes,
            },
          };
        }

        settings[i].mapping[id].total++;
        settings[i].mapping[id].votes[vote.vote]++;
      });
    });

    // Votes (sorted)
    settings.forEach((setting, i) => {

      // Categories
      const sorted = Object
        .keys(setting.mapping)
        .filter(id => id !== '0')
        .map(id => setting.mapping[id])
        .sort((a, b) => b.total - a.total);

      sorted.forEach((record, j) => {

        // Keep record
        if (j < barCountMax) {

          settings[i].categoryIds.push(record.id);

        // Aggregate record into 'other'
        } else {

          settings[i].mapping['0'].total += record.total;

          suggestionVoteIds.forEach(suggestionVote => {

            settings[i].mapping['0'].votes[suggestionVote.value] += record.votes[suggestionVote.value];
          });
        }
      });

      // Add 'other' as last category
      settings[i].categoryIds.push('0');
    });

    // Series
    const colors: string[] = [
      '#cc0000',
      '#ff6600',
      '#ffd500',
      '#00cccc',
      '#19c719',
    ];

    settings.forEach((setting, i) => {

      suggestionVoteIds.forEach((suggestionVote, j) => {

        const series = {
          type: 'column',
          name: suggestionVote.text,
          color: colors[j % suggestionVoteIds.length],
          data: [],
        };

        setting.categoryIds.forEach(categoryId => {

          series.data.push(settings[i].mapping[categoryId].votes[suggestionVote.value]);
        });

        settings[i].series.unshift(series);
      });

      this.charts[i] = new Chart({
        ...this.chartOptions,
        xAxis: {
          ...this.chartOptions.xAxis,
          categories: settings[i].categoryIds.map(categoryId => settings[i].mapping[categoryId].name),
        },
        series: settings[i].series,
      });
    });
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.runtimePermissions$ = this.runtimeService.selectPermissions();
    this.options$ = this.pageService.selectOptions();

    // Select content in current language
    this.subscriptions.push(
      combineLatest([
        this.runtimeService.selectCurrentLanguageId(),
        this.pageService.selectModel(),
      ])
      .pipe(
        map(([language, model]) => model.contents.find(content => content.language === language)),
      )
      .subscribe(suggestionContentModel => this.content = suggestionContentModel || this.content),
    );
  }

  /**
   * Next model
   */
  protected onNextModel(model: SuggestionModel): void {

    super.onNextModel(model);

    // Images
    this.images = model.images.map(image => {

      return {
        title: image.label,
        url: image.url,
        thumbnailUrl: image.url,
      };
    });
  }
}
