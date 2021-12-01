import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { AgencyProfileLoadResponseInterface } from './agency-profile-load-response.interface';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { AgencyModel } from '../../../shared/model/agency.model';
import { ContactAddressModel } from '../../../shared/model/contact-address.model';
import { ContactEmailModel } from '../../../shared/model/contact-email.model';
import { ContactPhoneModel } from '../../../shared/model/contact-phone.model';
import { ContactSocialModel } from '../../../shared/model/contact-social.model';
import { HelperService } from '../../../core/shared/helper.service';
import { DocumentModel } from '../../../shared/model/document.model';
import { AgencyProfileSetLogoResponseInterface } from './agency-profile-set-logo-response.interface';
import { AgencyProfileSetWatermarkResponseInterface } from './agency-profile-set-watermark-response.interface';
import { AgencyProfileSetDefaultPropertyImageResponseInterface } from './agency-profile-set-property-image-response.interface';
import { AgencyProfileSetPrestigeBrochureCoverResponseInterface } from './agency-profile-set-prestige-brochure-cover-response.interface';
import { AgencyProfileSetEmailBannerResponseInterface } from './agency-profile-set-email-banner-response.interface';
import { AgencyProfileEmailPreviewResponseInterface } from './agency-profile-email-preview-response.interface';
import { LegacySaveResponseInterface } from '../../format/legacy/response/legacy-save-response.interface';
import { AgencyProfileSaveRequestInterface } from './agency-profile-save-request.interface';

@Injectable()
export class AgencyProfileApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
  ) {

  }

  /**
   * Load
   */
  load(): Observable<AgencyModel> {

    return this.httpService.get<null, AgencyProfileLoadResponseInterface>(
      ApiEndpointEnum.agencyLoad,
      null,
      null,
      true,
    ).pipe(
      map(response => this.loadResponse(response)),
    );
  }

  /**
   * Set image as agency logo
   */
  setLogo(document: DocumentModel): Observable<AgencyProfileSetLogoResponseInterface> {

    return this
      .httpService
      .post<null, AgencyProfileSetLogoResponseInterface>(
        ApiEndpointEnum.agencySetLogo,
        null,
        {
          documentId: document.id,
          isSet: null,
        },
        true,
      );
  }

  /**
   * Set image as agency watermark
   */
  setWatermark(document: DocumentModel): Observable<AgencyProfileSetWatermarkResponseInterface> {

    return this
      .httpService
      .post<null, AgencyProfileSetWatermarkResponseInterface>(
        ApiEndpointEnum.agencySetWatermark,
        null,
        {
          documentId: document.id,
        },
        true,
      );
  }

  /**
   * Set image as default property image
   */
  setDefaultPropertyImage(document: DocumentModel): Observable<AgencyProfileSetDefaultPropertyImageResponseInterface> {

    return this
      .httpService
      .post<null, AgencyProfileSetDefaultPropertyImageResponseInterface>(
        ApiEndpointEnum.agencySetDefaultPropertyImage,
        null,
        {
          documentId: document.id,
          isSet: null,
        },
        true,
      );
  }

  /**
   * Set image as prestige brochure cover
   */
  setPrestigeBrochureCover(document: DocumentModel): Observable<AgencyProfileSetPrestigeBrochureCoverResponseInterface> {

    return this
      .httpService
      .post<null, AgencyProfileSetPrestigeBrochureCoverResponseInterface>(
        ApiEndpointEnum.agencySetPrestigeBrochureCover,
        null,
        {
          documentId: document.id,
          isSet: null,
        },
        true,
      );
  }

  /**
   * Set image as email banner
   */
  setEmailBanner(document: DocumentModel): Observable<AgencyProfileSetEmailBannerResponseInterface> {

    return this
      .httpService
      .post<null, AgencyProfileSetEmailBannerResponseInterface>(
        ApiEndpointEnum.agencySetEmailBanner,
        null,
        {
          documentId: document.id,
          isSet: null,
        },
        true,
      );
  }

  /**
   * Load email preview
   */

  loadEmailPreview(model: AgencyModel): Observable<string> {

    return this
      .httpService
      .post<null, AgencyProfileEmailPreviewResponseInterface>(
        ApiEndpointEnum.agencyEmailPreview,
        null,
        { templateId: model.emailTemplateId },
        true,
      ).pipe(map(response => response.template));
  }

  /**
   * Save agency profile
   */
  save(model: AgencyModel): Observable<LegacySaveResponseInterface> {

    return this
      .httpService
      .post<AgencyProfileSaveRequestInterface, LegacySaveResponseInterface>(
        ApiEndpointEnum.agencySave,
        this.saveRequest(model),
        null,
        true,
      );
  }

  /**
   * Handle a load() response and return an Agency model
   */
  private loadResponse(data: AgencyProfileLoadResponseInterface): AgencyModel {

    const model = new AgencyModel();

    model.id = data.id;
    model.name = data.agency_name;
    model.reference = data.agency_reference;
    model.administrator = data.administrator;
    model.description = data.agency_profile;
    model.reference = data.agency_reference;
    model.logo = new DocumentModel();
    model.watermark = new DocumentModel();

    // Logo
    if (data.logo_id) {

      model.logo.id = data.logo_id;
      model.logo.photoSmallURL = data.logo_url;
    }

    // Watermark
    if (data.watermark_id) {

      model.watermark.id = data.watermark_id;
      model.watermark.photoSmallURL = data.watermark_url;
    }

    model.watermarkOpacity = (data.watermark_opacity || 1) * 100;
    model.bgColorHeaderFooter = data.background_color_head_foot;
    model.textColorHeaderFooter = data.text_color_head_foot;
    model.bgColorMain = data.background_color_main;
    model.textColorMain = data.text_color_main;
    model.bgColorMessage = data.background_color_message;
    model.textColorMessage = data.text_color_message;
    model.bgColorTitle = data.background_color_property_title;
    model.textColorTitle = data.text_color_property_title;
    model.president = data.ceo;
    model.director = data.director;
    model.city = data.city;
    model.zipCode = data.zip_code;
    model.countryId = data.country;
    model.fax = data.fax;
    model.foundingYear = data.foundation_year;
    model.founder = data.founder;
    model.employeeCount = data.nb_employees;
    model.isAppliedWatermarkOnBrochure = data.watermark_on_brochure === 1;
    model.isAppliedWatermarkOnPortal = data.watermark_on_gateway === 1;
    model.isAppliedWatermarkOnWebsite = data.watermark_on_website === 1;
    model.whitelistedDomains = data.whitelisted_domains;
    model.createContactId = data.created_by_id;
    model.createContactName = data.created_by_name;
    model.createDate = this.helperService.stringToDate(data.creation_datetime);
    model.updateDate = this.helperService.stringToDate(data.update_datetime);
    model.updateContactId = data.updated_by_id;
    model.updateContactName = data.updated_by_name;

    // Email
    model.emails = (data.emails || []).map(email => {

      const emailModel = new ContactEmailModel();
      const emailSegments = email.split('|^|');

      emailModel.emailId = emailSegments[0];
      emailModel.notes = emailSegments[2];
      emailModel.isUsedMailing = emailSegments[3] === '1';
      emailModel.isMainEmail = emailSegments[1] === '1';

      return emailModel;
    });

    // Mobiles
    model.mobiles = (data.mobiles || []).map(mobile => {

      const mobileModel = new ContactPhoneModel();
      const mobileSegments = mobile.split('|^|');

      mobileModel.number = mobileSegments[0];
      mobileModel.isMainNumber = mobileSegments[1] === '1';
      mobileModel.notes = mobileSegments[2];

      return mobileModel;
    });

    // Landlines
    model.landlines = (data.landlines || []).map(landline => {

      const landlineModel = new ContactPhoneModel();
      const landlineSegments = landline.split('|^|');

      landlineModel.number = landlineSegments[0];
      landlineModel.isMainNumber = landlineSegments[1] === '1';
      landlineModel.notes = landlineSegments[2];

      return landlineModel;
    });

    // Addresses
    model.addresses = (data.addresses || []).map(address => {

      const addressModel = new ContactAddressModel();
      const addressSegments = address.split('|^|');

      addressModel.line1 = addressSegments[0];

      addressModel.zipCode = addressSegments[1];
      addressModel.city = addressSegments[2];
      addressModel.countryId = addressSegments[3];
      addressModel.isMainAddress = addressSegments[4] === '1';
      addressModel.notes = addressSegments[5];
      addressModel.line2 = addressSegments[6];
      addressModel.line3 = addressSegments[7];

      return addressModel;
    });

    // Social media
    Object.keys(data.social_media_links).forEach(media => {

      const social = new ContactSocialModel();
      social.network = media;
      social.url = data.social_media_links[media];

      model.socials.push(social);
    });

    return model;
  }

  /**
   * Handle a save() request parameters and return a formatted request
   */
  private saveRequest(model: AgencyModel): AgencyProfileSaveRequestInterface {

    let mainMobile = '';
    let mainLandline = '';
    let mainEmail = '';
    let mainAddress: ContactAddressModel|null = null;

    model.mobiles.forEach(mobile => mobile.isMainNumber ? mainMobile = mobile.number : null);
    model.landlines.forEach(landline => landline.isMainNumber ? mainLandline = landline.number : null);
    model.emails.forEach(email => email.isMainEmail ? mainEmail = email.emailId : null);
    model.addresses.forEach(address => address.isMainAddress ? mainAddress = address : null);

    const request: AgencyProfileSaveRequestInterface = {
      agency_id: model.id,
      agency_name: model.name,
      agency_profile: model.description,
      foundation_year: model.foundingYear,
      founder: model.founder,
      director: model.director,
      ceo: model.president,
      administrator: model.administrator,
      nb_employees: model.employeeCount,
      mobile_visible: mainMobile,
      landLine_visible: mainLandline,
      email_visible: mainEmail,
      fax: model.fax,
      address_visible: mainAddress ? (mainAddress.zipCode + ' ' + mainAddress.city) : '',
      mobile: model.mobiles
        .filter(mobile => mobile.isRemoved === false)
        .map(m => [m.number, (m.isMainNumber ? '1' : '0'), m.notes].join('|^|')),
      landLine: model.landlines
        .filter(landLine => landLine.isRemoved === false)
        .map(p => [p.number, (p.isMainNumber ? '1' : '0'), p.notes].join('|^|')),
      email: model.emails
        .filter(email => email.isRemoved === false)
        .map(e => [e.emailId, (e.isMainEmail ? '1' : '0'), e.notes, (e.isUsedMailing ? '1' : '0'), '0'].join('|^|'),
      ),
      address: model.addresses
        .filter(address => address.isRemoved === false)
        .map(a => [a.line1, a.zipCode, a.city, a.countryId, (a.isMainAddress ? '1' : '0'), a.notes, a.line2, a.line3].join('|^|'),
      ),
      zip_code: mainAddress ? mainAddress.zipCode : '',
      city: mainAddress ? mainAddress.city : '',
      country: mainAddress ? mainAddress.countryId : '',
      id_select_template: model.emailTemplateId,
      background_color_head_foot: model.bgColorHeaderFooter,
      background_color_main: model.bgColorMain,
      background_color_message: model.bgColorMessage,
      background_color_property_title: model.bgColorTitle,
      text_color_head_foot: model.textColorHeaderFooter,
      text_color_main: model.textColorMain,
      text_color_message: model.textColorMessage,
      text_color_property_title: model.textColorTitle,
      watermark_transparency: model.watermarkOpacity,
      watermark_on_brochure: model.isAppliedWatermarkOnBrochure ? '1' : '0',
      watermark_on_website: model.isAppliedWatermarkOnWebsite ? '1' : '0',
      watermark_on_gateway: model.isAppliedWatermarkOnPortal ? '1' : '0',
    };

    // Social media links
    model.socials.forEach(social => request[social.network] = social.url);

    return request;
  }
}
