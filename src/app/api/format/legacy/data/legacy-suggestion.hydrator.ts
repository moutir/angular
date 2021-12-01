import { Injectable } from '@angular/core';

import { HelperService } from '../../../../core/shared/helper.service';
import { LegacyContactHydrator } from './legacy-contact.hydrator';
import { LegacySuggestionImageDataInterface } from './legacy-suggestion-image-data.interface';
import { SuggestionImageModel } from '../../../../shared/model/suggestion-image.model';
import { LegacySuggestionContentDataInterface } from './legacy-suggestion-content-data.interface';
import { SuggestionContentModel } from '../../../../shared/model/suggestion-content.model';
import { LegacySuggestionTagDataInterface } from './legacy-suggestion-tag-data.interface';
import { SuggestionTagModel } from '../../../../shared/model/suggestion-tag.model';
import { LegacySuggestionVoteDataInterface } from './legacy-suggestion-vote-data.interface';
import { SuggestionVoteModel } from '../../../../shared/model/suggestion-vote.model';
import { LegacySuggestionDataInterface } from './legacy-suggestion-data.interface';
import { SuggestionModel } from '../../../../shared/model/suggestion.model';

@Injectable()
export class LegacySuggestionHydrator {

  /**
   * Constructor
   */
  constructor(
    private legacyContactHydrator: LegacyContactHydrator,
    private helperService: HelperService,
  ) {

  }

  /**
   * Return a SuggestionModel from SuggestionDataInterface
   */
  hydrateModel(data: LegacySuggestionDataInterface): SuggestionModel {

    const suggestion = new SuggestionModel();

    suggestion.id = data.id;
    suggestion.clientBenefit = data.clientBenefit;
    suggestion.realforceBenefit = data.realforceBenefit;
    suggestion.complexity = data.complexity;
    suggestion.statusId = data.statusId;
    suggestion.score = data.score;
    suggestion.voteCount = data.voteCount;
    suggestion.popularity = data.popularity;
    suggestion.isMarketable = data.isMarketable;
    suggestion.isPublished = data.isPublished;
    suggestion.voteId = data.voteId;
    suggestion.createDate = this.helperService.stringToDate(data.createDatetime, false);
    suggestion.updateDate = this.helperService.stringToDate(data.updateDatetime, false);

    if (data.createContact) {

      suggestion.createContact = this.legacyContactHydrator.hydrateModel(data.createContact);
    }

    if (data.updateContact) {

      suggestion.updateContact = this.legacyContactHydrator.hydrateModel(data.updateContact);
    }

    if (data.images) {

      suggestion.images = data.images.map(image => this.hydrateModelImage(image));
    }

    if (data.contents) {

      suggestion.contents = data.contents.map(content => this.hydrateModelContent(content));
    }

    if (data.tags) {

      suggestion.tags = data.tags.map(tag => this.hydrateModelTag(tag));
    }

    return suggestion;
  }

  /**
   * Return a SuggestionDataInterface from SuggestionModel
   */
  hydrateData(model: SuggestionModel): LegacySuggestionDataInterface {

    const data: LegacySuggestionDataInterface = {
      id: model.id,
      createDatetime: null, // Always let backend handle it
      createAccountId:  null, // Always let backend handle it
      createContact: null, // Always let backend handle it
      updateDatetime: null, // Always let backend handle it
      updateAccountId:  null, // Always let backend handle it
      updateContact: null, // Always let backend handle it
      clientBenefit: model.clientBenefit,
      realforceBenefit: model.realforceBenefit,
      complexity: model.complexity,
      statusId: model.statusId,
      score: model.score,
      voteCount: model.voteCount,
      popularity: model.popularity,
      isMarketable: model.isMarketable,
      isPublished: model.isPublished,
      images: model.images.map(image => this.hydrateDataImage(image)),
      contents: model.contents.map(content => this.hydrateDataContent(content)),
      tags: model.tags.map(tag => this.hydrateDataTag(tag)),
      voteId: null, // Always let backend handle it
    };

    return data;
  }

  /**
   * Return a SuggestionImageModel from a SuggestionImageDataInterface
   */
  hydrateModelImage(data: LegacySuggestionImageDataInterface): SuggestionImageModel {

    const suggestionImage = new SuggestionImageModel();

    suggestionImage.id = data.id;
    suggestionImage.url = data.url;
    suggestionImage.label = data.label;
    suggestionImage.isRemoved = data.isRemoved;

    return suggestionImage;
  }

  /**
   * Return a SuggestionContentModel from a SuggestionContentDataInterface
   */
  hydrateModelContent(data: LegacySuggestionContentDataInterface): SuggestionContentModel {

    const suggestionContent = new SuggestionContentModel();

    suggestionContent.id = data.id;
    suggestionContent.language = data.language;
    suggestionContent.title = data.title;
    suggestionContent.problem = data.problem;
    suggestionContent.solution = data.solution;
    suggestionContent.isComputerTranslated = data.isComputerTranslated;
    suggestionContent.isRemoved = data.isRemoved;

    return suggestionContent;
  }

  /**
   * Return a SuggestionTagModel from a SuggestionTagDataInterface
   */
  hydrateModelTag(data: LegacySuggestionTagDataInterface): SuggestionTagModel {

    const suggestionTag = new SuggestionTagModel();

    suggestionTag.id = data.id;
    suggestionTag.name = data.name;

    return suggestionTag;
  }

  /**
   * Return a SuggestionVoteModel from a SuggestionVoteDataInterface
   */
  hydrateModelVote(data: LegacySuggestionVoteDataInterface): SuggestionVoteModel {

    const suggestionVote = new SuggestionVoteModel();

    suggestionVote.id = data.id;
    suggestionVote.vote = data.vote;
    suggestionVote.createDate = this.helperService.stringToDate(data.createDatetime, false);
    suggestionVote.createAccountTypeId = data.createAccountTypeId;

    if (data.createContact) {

      suggestionVote.createContact = this.legacyContactHydrator.hydrateModel(data.createContact);
    }

    return suggestionVote;
  }

  /**
   * Return a SuggestionImageDataInterface from a SuggestionImageModel
   */
  hydrateDataImage(model: SuggestionImageModel): LegacySuggestionImageDataInterface {

    return {
      id: model.id,
      url: model.url,
      label: model.label,
      isRemoved: model.isRemoved,
    };
  }

  /**
   * Return a SuggestionContentDataInterface from a SuggestionContentModel
   */
  hydrateDataContent(model: SuggestionContentModel): LegacySuggestionContentDataInterface {

    return {
      id: model.id,
      language: model.language,
      title: model.title,
      problem: model.problem,
      solution: model.solution,
      isComputerTranslated: model.isComputerTranslated,
      isRemoved: model.isRemoved,
    };
  }

  /**
   * Return a SuggestionTagDataInterface from a SuggestionTagModel
   */
  hydrateDataTag(model: SuggestionTagModel): LegacySuggestionTagDataInterface {

    return {
      id: model.id,
      name: model.name,
    };
  }

  /**
   * Return a SuggestionVoteDataInterface from a SuggestionVoteModel
   */
  hydrateDataVote(model: SuggestionVoteModel): LegacySuggestionVoteDataInterface {

    return {
      id: model.id,
      vote: model.vote,
      createDatetime: null, // Always let backend handle it
      createAccountId: null, // Always let backend handle it
      createAccountTypeId: null, // Always let backend handle it
      createContact: null, // Always let backend handle it
    };
  }
}
