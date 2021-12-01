import { Injectable } from '@angular/core';

import { LegacyContactDataInterface } from './legacy-contact-data.interface';
import { ContactModel } from '../../../../shared/model/contact.model';
import { LegacyAgencyHydrator } from './legacy-agency.hydrator';
import { HelperService } from '../../../../core/shared/helper.service';
import { SearchModel } from '../../../../shared/model/search.model';
import { ContactEmailModel } from '../../../../shared/model/contact-email.model';
import { PhoneTypeEnum } from '../../../../shared/enum/phone-type.enum';
import { ContactPhoneModel } from '../../../../shared/model/contact-phone.model';

@Injectable()
export class LegacyContactHydrator {

  /**
   * Constructor
   */
  constructor(
    private legacyAgencyHydrator: LegacyAgencyHydrator,
    private helperService: HelperService,
  ) {

  }

  /**
   * Return a ContactModel from ContactDataInterface
   */
  hydrateModel(data: LegacyContactDataInterface): ContactModel {

    const contact = new ContactModel();

    contact.id = data.id;
    contact.reference = '#' + data.reference;
    contact.firstName = data.firstname;
    contact.lastName = data.lastname;
    contact.fullName = [data.firstname, data.lastname].filter(str => !!str).join(' ');
    contact.initials = data.initials;
    contact.ranking = parseInt(data.ranking, 10);
    contact.lastContactDate = this.helperService.stringToDate(data.lastContactDate, false) || contact.lastContactDate;
    contact.isConfidential = data.isConfidential;
    contact.contactTypeIds = data.contactTypeIds;

    // Agency
    if (data.agency) {

      contact.agency = this.legacyAgencyHydrator.hydrateModel(data.agency);
    }

    // Brokers
    contact.mainContact = data.mainContact ? this.hydrateModel(data.mainContact) : null;
    contact.saleContact = data.saleContact ? this.hydrateModel(data.saleContact) : null;
    contact.rentalContact = data.rentalContact ? this.hydrateModel(data.rentalContact) : null;

    // Emails
    if (data.emails) {

      contact.emails = data.emails.map(emailData => {

        const email = new ContactEmailModel();

        email.emailId = emailData.value;
        email.isInvalid = emailData.isInvalid;

        return email;
      });
    }

    // Phones
    if (data.phones) {

      data.phones.forEach(phoneData => {

        const phone = new ContactPhoneModel();
        phone.type = phoneData.type;
        phone.number = phoneData.number;

        switch (phoneData.type) {

          case PhoneTypeEnum.mobile:
            contact.mobiles.push(phone);
            break;

          case PhoneTypeEnum.landline:
            contact.landlines.push(phone);
            break;

          case PhoneTypeEnum.fax:
            contact.faxes.push(phone);
            break;
        }
      });
    }

    // Searches
    if (data.searches) {

      contact.searches = data.searches.map(searchData => {

        const search = new SearchModel();

        search.id = searchData.id;
        search.title = searchData.title;
        search.statusId = searchData.statusId;
        search.brokerContact = searchData.brokerContact ? this.hydrateModel(searchData.brokerContact) : null;

        return search;
      });
    }

    return contact;
  }
}
