import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { RuntimeUserPreferenceInterface } from '../../../shared/interface/runtime-user-preference.interface';
import { UserSavePreferenceResponseInterface } from './user-save-preference-response.interface';
import { UserSavePreferenceRequestInterface } from './user-save-preference-request.interface';
import { UserModel } from '../../../shared/model/user.model';
import { UserLoadResponseInterface } from './user-load-response.interface';
import { LegacySaveResponseInterface } from '../../format/legacy/response/legacy-save-response.interface';
import { HelperService } from '../../../core/shared/helper.service';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { ContactPhoneModel } from '../../../shared/model/contact-phone.model';
import { ContactEmailModel } from '../../../shared/model/contact-email.model';
import { ContactAddressModel } from '../../../shared/model/contact-address.model';
import { UserSaveRequestInterface } from './user-save-request.interface';
import { ContactSocialModel } from '../../../shared/model/contact-social.model';

@Injectable()
export class UserApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
  ) {

  }

  /**
   * Load user
   */
  load(): Observable<UserModel> {

    return this
      .httpService
      .get<null, UserLoadResponseInterface>(
        ApiEndpointEnum.userLoad,
        null,
        null,
        null,
      )
      .pipe(map(response => this.loadResponse(response)))
    ;
  }

  /**
   * Save user
   */
  save(user: UserModel): Observable<LegacySaveResponseInterface> {

    return this
      .httpService
      .post<UserSaveRequestInterface, LegacySaveResponseInterface>(
        ApiEndpointEnum.userSave,
        this.saveRequest(user),
        null,
        true,
      );
  }

  /**
   * Save preference
   */
  savePreference(userPreference: RuntimeUserPreferenceInterface): Observable<UserSavePreferenceResponseInterface> {

    return this
      .httpService
      .post<UserSavePreferenceRequestInterface, UserSavePreferenceResponseInterface>(ApiEndpointEnum.accountSavePreference, {
        preference: JSON.stringify(userPreference),
      });
  }

  /**
   * Handle an load() response and return a user model
   */
  private loadResponse(response: UserLoadResponseInterface): UserModel {

    const model = new UserModel();

    if (!response || !(response.profile && response.account)) {

      return model;
    }

    // Profile info
    model.account.contact.id = response.profile.id;
    model.account.contact.firstName = response.profile.firstname;
    model.account.contact.lastName = response.profile.lastname;
    model.account.contact.titleId = response.profile.title;
    model.account.contact.photoId = response.profile.photo_id;
    model.account.contact.photoURL = response.profile.photo_url;
    model.account.contact.greetingId = response.profile.greeting;
    model.account.contact.languageId = <LanguageEnum>response.profile.language;
    model.account.contact.birthDate = this.helperService.stringToDate(response.profile.birth_date);
    model.account.contact.zipCode = response.profile.zip_code;
    model.account.contact.city = response.profile.city;
    model.account.contact.countryId = response.profile.country_id;
    model.account.contact.nationalityId = response.profile.nationality;
    model.account.contact.maritalStatusId = response.profile.marital_status;
    model.account.contact.childrenId = response.profile.children;
    model.account.contact.companyName = response.profile.company;
    model.account.contact.profession = response.profile.profession;
    model.account.contact.bankReference = response.profile.bank_reference;

    // Sometimes BE returns object instead of array
    response.profile.mobiles = (response.profile.mobiles instanceof Array) ?
      response.profile.mobiles : Object.values(response.profile.mobiles || {});

    response.profile.landlines = (response.profile.landlines instanceof Array) ?
      response.profile.landlines : Object.values(response.profile.landlines || {});

    response.profile.emails = (response.profile.emails instanceof Array) ?
      response.profile.emails : Object.values(response.profile.emails || {});

    response.profile.addresses = (response.profile.addresses instanceof Array) ?
      response.profile.addresses : Object.values(response.profile.addresses || {});

    // Mobiles
    (response.profile.mobiles || []).forEach(mobile => {

      if (!mobile.number) {

        return;
      }

      const phone = new ContactPhoneModel();
      phone.number = mobile.number;
      phone.notes = mobile.notes;
      phone.isMainNumber = mobile.is_main_number;

      model.account.contact.mobiles.push(phone);
    });

    // Landlines
    (response.profile.landlines || []).forEach(landline => {

      if (!landline.number) {

        return;
      }

      const phone = new ContactPhoneModel();
      phone.number = landline.number;
      phone.notes = landline.notes;
      phone.isMainNumber = landline.is_main_number;

      model.account.contact.landlines.push(phone);
    });

    // Emails
    (response.profile.emails || []).forEach(e => {

      const email = new ContactEmailModel();
      email.emailId = e.email;
      email.notes = e.notes;
      email.isMainEmail = e.is_main_email;
      email.isUsedMailing = e.is_used_mailing;

      model.account.contact.emails.push(email);
    });

    // Addresses
    (response.profile.addresses || []).forEach(a => {

      const address = new ContactAddressModel();
      address.line1 = a.line1;
      address.line2 = a.line2;
      address.line3 = a.line3;
      address.zipCode = a.zip_code;
      address.city = a.city;
      address.countryId = a.country_id;
      address.notes = a.notes;
      address.isMainAddress = a.is_main_address;

      model.account.contact.addresses.push(address);
    });

    // Social media
    Object.keys(response.profile.social_media_links).forEach(network => {

      const social = new ContactSocialModel();
      social.network = network;
      social.url = response.profile.social_media_links[network];

      model.account.contact.socials.push(social);
    });

    // Account (through contact)
    model.account.contact.accountId = response.account.id;
    model.account.contact.accountLogin = response.account.login;
    model.account.contact.accountTypeId = response.account.type;
    model.account.contact.accountLanguageId = response.account.preferred_language;
    model.account.contact.accountHomePageId = response.account.preferred_home_page;
    model.account.contact.accountMenuDisplayId = response.account.preferred_menu_display;
    model.account.contact.accountNotes = response.account.user_profile;
    model.account.contact.accountIsAllowedSwitching = response.account.is_allowed_switching === '1';
    model.account.contact.accountIsEnabledGoogleAgenda = response.account.is_enabled_google_agenda === '1';
    model.account.contact.accountIsEnabledSendEmailOnBehalf = response.account.allow_send_on_behalf === '1';
    model.account.contact.accountExpiryDate = this.helperService.stringToDate(response.account.expiry_date);

    // Account
    model.id = response.account.id;
    model.account.id = model.account.contact.accountId;
    model.account.login = model.account.contact.accountLogin;
    model.account.language.value = model.account.contact.accountLanguageId;
    model.account.notes = model.account.contact.accountNotes;
    model.account.isAllowedSwitching = model.account.contact.accountIsAllowedSwitching;
    model.account.isEnabledGoogleAgenda = model.account.contact.accountIsEnabledGoogleAgenda;
    model.account.isEnabledSendEmailOnBehalf = model.account.contact.accountIsEnabledSendEmailOnBehalf;
    model.account.expiryDate = model.account.contact.accountExpiryDate;
    model.account.accountType.value = model.account.contact.accountTypeId;

    return model;
  }

  /**
   * Handle save() request parameters and return a formatted request
   */
  private saveRequest(model: UserModel): UserSaveRequestInterface {

    let mobileVisible = '';
    let landlineVisible = '';
    let emailVisible = '';
    let mainAddress: ContactAddressModel|null = null;

    model.account.contact.mobiles.forEach(mobile => mobile.isMainNumber ? mobileVisible = mobile.number : null);
    model.account.contact.landlines.forEach(landline => landline.isMainNumber ? landlineVisible = landline.number : null);
    model.account.contact.emails.forEach(email => email.isMainEmail ? emailVisible = email.emailId : null);
    model.account.contact.addresses.forEach(address => address.isMainAddress ? mainAddress = address : null);

    const request: UserSaveRequestInterface = {

      // Account
      account_id: model.account.id,
      account_login: model.account.login,
      account_pwd: model.account.password,
      account_pwd_confirm: model.account.passwordConfirm,
      account_user_profile: model.account.notes,
      preferred_language: model.account.language.value,
      allow_switching: model.account.isAllowedSwitching ? '1' : '0',
      enable_google_agenda: model.account.isEnabledGoogleAgenda ? '1' : '0',
      allow_send_on_behalf: model.account.isEnabledSendEmailOnBehalf ? '1' : '0',

      // Account (legacy data, we keep it for now but do not manage it through UI)
      preferred_menu_display: model.account.contact.accountMenuDisplayId,
      preferred_home_page: model.account.contact.accountHomePageId,

      // Profile
      contact_id: model.account.contact.id,
      contact_title: model.account.contact.titleId,
      contact_greeting: model.account.contact.greetingId,
      contact_language: model.account.contact.languageId || '',
      contact_firstName: model.account.contact.firstName,
      contact_lastName: model.account.contact.lastName,
      mobile_visible: mobileVisible,
      landLine_visible: landlineVisible,
      email_visible: emailVisible,
      address_visible: mainAddress ? (mainAddress.zipCode + ' ' + mainAddress.city) : '',
      contact_birthday: this.helperService.dateToString(model.account.contact.birthDate),
      contact_nationality: model.account.contact.nationalityId,
      contact_family_status: model.account.contact.maritalStatusId,
      contact_children: model.account.contact.childrenId,
      zip_code: mainAddress ? mainAddress.zipCode : '',
      city: mainAddress ? mainAddress.city : '',
      country: mainAddress ? mainAddress.countryId : '',
      contact_company: model.account.contact.companyName,
      contact_job: model.account.contact.profession,
      contact_banking_reference: model.account.contact.bankReference,
      mobile: model.account.contact.mobiles
        .filter(mobile => mobile.isRemoved === false)
        .map(m => [m.number, (m.isMainNumber ? '1' : '0'), m.notes].join('|^|')),
      landLine: model.account.contact.landlines
        .filter(landLine => landLine.isRemoved === false)
        .map(p => [p.number, (p.isMainNumber ? '1' : '0'), p.notes].join('|^|')),
      email: model.account.contact.emails
        .filter(email => email.isRemoved === false)
        .map(e => [e.emailId, (e.isMainEmail ? '1' : '0'), e.notes, (e.isUsedMailing ? '1' : '0'), '0'].join('|^|'),
      ),
      address: model.account.contact.addresses
        .filter(address => address.isRemoved === false)
        .map(a => [a.line1, a.zipCode, a.city, a.countryId, (a.isMainAddress ? '1' : '0'), a.notes, a.line2, a.line3].join('|^|'),
      ),
    };

    // Social media links
    model.account.contact.socials.forEach(social => request['contact_' + social.network] = social.url);

    return request;
  }
}
