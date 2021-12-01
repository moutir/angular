import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { WebsiteSearchModel } from '../../../shared/model/website-search.model';
import { WebsiteModel } from '../../../shared/model/website.model';
import { WebsiteListRequestInterface } from './website-list-request.interface';
import { WebsiteListResponseInterface } from './website-list-response.interface';
import { WebsiteLoadResponseInterface } from './website-load-response.interface';
import { WebsiteSaveRequestInterface } from './website-save-request.interface';
import { LegacySaveResponseInterface } from '../../format/legacy/response/legacy-save-response.interface';
import { ContactModel } from '../../../shared/model/contact.model';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { WebsiteContentModel } from '../../../shared/model/website-content.model';

@Injectable()
export class WebsiteApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
  ) {

  }

  /**
   * List
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: WebsiteSearchModel,
  ): Observable<ModelListInterface<WebsiteModel>> {

    return this
      .httpService
      .get<WebsiteListRequestInterface, WebsiteListResponseInterface>(
        ApiEndpointEnum.websiteList,
        this.listRequest(pagination, sort, filters),
        null,
        true,
      )
      .pipe(
        map(response => this.listResponse(response)),
      )
    ;
  }

  /**
   * Load
   */
  load(id: string): Observable<WebsiteModel> {

    return this.httpService.get<null, WebsiteLoadResponseInterface>(
      ApiEndpointEnum.websiteLoad,
      null,
      { id },
      true,
    ).pipe(
      map(response => this.loadResponse(response)),
    );
  }

  /**
   * Save website
   */
  save(website: WebsiteModel): Observable<LegacySaveResponseInterface> {

    return this
      .httpService
      .post<WebsiteSaveRequestInterface, LegacySaveResponseInterface>(
        ApiEndpointEnum.websiteSave,
        this.saveRequest(website),
        { id: website.id },
        true,
      );
  }

  /**
   * Handle a list() request parameters and return a formatted request
   */
  private listRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: WebsiteSearchModel,
  ): WebsiteListRequestInterface {

    const request = <WebsiteListRequestInterface> {
      start: (pagination.page - 1) * pagination.perPage,
      length: pagination.perPage,
      sort_id: sort.id,
      sort_order: sort.order,
    };

    if (filters.url) {

      request.main_url = filters.url;
    }

    if (filters.privateAPIKey) {

      request.api_key = filters.privateAPIKey;
    }

    if (filters.publicAPIKey) {

      request.api_key_public = filters.publicAPIKey;
    }

    return request;
  }

  /**
   * Handle a list() response and return a list of website models
   */
  private listResponse(response: WebsiteListResponseInterface): ModelListInterface<WebsiteModel> {

    return {
      models: response.data.map((data, i) => {

        const website = new WebsiteModel();

        website.id = data.DT_RowId;

        website.url = data.main_url;
        website.ipAddress = data.server_ip_address;
        website.privateAPIKey = data.api_key;
        website.publicAPIKey = data.api_key_public;
        website.isActive = parseInt(data.active, 10) === 1;
        website.isActiveFisher = parseInt(data.enable_fisher, 10) === 1;
        website.isInternal = parseInt(data.is_internal, 10) === 1;

        return website;
      }),
      total: parseInt(response.recordsTotal, 10),
    };
  }

  /**
   * Handle a load() response and return an website model
   */
  private loadResponse(data: WebsiteLoadResponseInterface): WebsiteModel {

    const model = new WebsiteModel();

    model.id = data.id;
    model.url = data.url;
    model.layoutId = data.website_layout;
    model.templateId = data.template;
    model.isActive = parseInt(data.active, 10) === 1;
    model.isActiveFisher = data.activate_fisher;
    model.isInternal = parseInt(data.is_internal, 10) === 1;
    model.availableLanguageIds = (data.lang_available || []).map(lang => <LanguageEnum>lang);
    model.defaultLanguageId = data.default_lang ? <LanguageEnum>data.default_lang : null;
    model.alternativeDomain = data.alternative_domain;
    model.facebookAppId = data.facebook_appid;
    model.googleAnalyticsAppId = data.google_analytics_appid;
    model.previewURL = data.preview_url;
    model.iframeSaleURL = model.previewURL + '/sale-listings';
    model.iframeRentURL = model.previewURL + '/rental-listings';
    model.ipAddress = data.server_ip_address;
    model.privateAPIKey = data.api_key;
    model.publicAPIKey = data.api_key_public;

    // Styles
    model.styleBlockBgColour = data.style.block_background_colour || '';
    model.styleDetailsAmenitiesFontColour = data.style.details_amenities_font_colour || '';
    model.styleDetailsTitleBgColour = data.style.details_title_background_colour || '';
    model.styleDetailsTitleBgShadowColour = data.style.details_title_background_shadow_colour || '';
    model.styleDetailsTopBarColour = data.style.details_top_bar_colour || '';
    model.styleFooterBgColour = data.style.footer_background_colour || '';
    model.styleHeaderFooterFontColour = data.style.header_footer_font_colour || '';
    model.stylePrimaryBgColour = data.style.primary_background_colour || '';
    model.stylePrimaryBgFlatColour = data.style.primary_background_flat_colour || '';
    model.stylePrimaryFontColour = data.style.primary_font_colour || '';
    model.styleSecondaryBgColour = data.style.secondary_background_colour || '';
    model.styleSecondaryFontColour = data.style.secondary_font_colour || '';
    model.styleSiteBgColour = data.style.site_background_colour || '';

    // Brokers
    if (data.selected_team_members) {

      model.brokers = data.selected_team_members.map(id => {

        const broker = new ContactModel();
        broker.id = id;

        return broker;
      });
    }

    // Home page contents
    (data.home_page_content || []).forEach(content => {

      const contentModel = new WebsiteContentModel();

      contentModel.title = content.title;
      contentModel.description = content.content;
      contentModel.seoKeyword = content.seo_keyword;
      contentModel.seoDescription = content.seo_description;

      // contentModel.description = '1st line&#160;<div><br></div><div>3rd line</div><div><br></div><div>5th line</div><div>6th line</div>';

      model.homePageContent[content.language] = contentModel;
    });

    return model;
}

  /**
   * Handle save() request parameters and return a formatted request
   */
  private saveRequest(model: WebsiteModel): WebsiteSaveRequestInterface {

    const request: WebsiteSaveRequestInterface = <WebsiteSaveRequestInterface>{
      url: model.url,
      website_layout: model.layoutId,
      template: model.templateId,
      default_lang: model.defaultLanguageId,
      lang_available: model.availableLanguageIds,
      alternative_domain: model.alternativeDomain,
      facebook_appid: model.facebookAppId,
      google_analytics_appid: model.googleAnalyticsAppId,
      activate_fisher: model.isActiveFisher ? '1' : '0',
      site_background_colour: model.styleSiteBgColour || '',
      primary_background_colour: model.stylePrimaryBgColour || '',
      primary_background_flat_colour: model.stylePrimaryBgFlatColour || '',
      secondary_background_colour: model.styleSecondaryBgColour || '',
      block_background_colour: model.styleBlockBgColour || '',
      footer_background_colour: model.styleFooterBgColour || '',
      primary_font_colour: model.stylePrimaryFontColour || '',
      secondary_font_colour: model.styleSecondaryFontColour || '',
      header_footer_font_colour: model.styleHeaderFooterFontColour || '',
      details_title_background_colour: model.styleDetailsTitleBgColour || '',
      details_title_background_shadow_colour: model.styleDetailsTitleBgShadowColour || '',
      details_amenities_font_colour: model.styleDetailsAmenitiesFontColour || '',
      details_top_bar_colour: model.styleDetailsTopBarColour || '',
      agency_website_team: model.brokers.map(broker => broker.id),
    };

    if (model.isInternal) {

      request.is_internal = '1';
    }

    if (model.isActive) {

      request.active = '1';
    }

    const homePageContent = {};

    Object.keys(model.homePageContent).forEach(lang => {

      homePageContent[lang] = {
        title: model.homePageContent[lang].title,
        description: model.homePageContent[lang].description,
        // description: (model.homePageContent[lang].description || '').replace(/div>/g, 'p> '),
        seo_keyword: model.homePageContent[lang].seoKeyword,
        seo_description: model.homePageContent[lang].seoDescription,
      };
    });

    request.home_page_contents = JSON.stringify(homePageContent);

    return request;
  }
}
