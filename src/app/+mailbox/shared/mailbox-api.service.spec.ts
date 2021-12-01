import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ApiEndpointEnum } from '../../shared/enum/api-endpoint.enum';
import { PhalconHttpService } from '../../api/http/phalcon-http.service';
import { MailboxModel } from './mailbox.model';
import { FolderModel } from './folder.model';
import { MailboxListModel } from './mailbox-list.model';
import { MailboxApiService } from './mailbox-api.service';
import { MailboxConfig } from '../mailbox.config';
import { BrowserServiceMock } from '../../core/shared/browser/browser.service.mock';

describe('MailboxApiService', () => {

  let service: MailboxApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        PhalconHttpService,
        MailboxApiService,
        { provide: MailboxConfig, useValue: new MailboxConfig(BrowserServiceMock()) },
      ],
    });

    service = TestBed.get(MailboxApiService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {

    httpMock.verify();
  });

  describe('loadEmailList()', () => {

    it('should return Observable<EmailListModel>', () => {

      const imapId = '5';
      const folderId = '50';
      const page = 1;
      const query = '';

      const response = {
        count_unseen: '0',
        data: [{id: '2186', folder_id: '50', folder_type: 'i'}, {id: '2185', folder_id: '50', folder_type: 'i'}],
        folders: [{id: '45', name: 'Junk', type: 'i', type_id: '1', unseen: 0}],
        page: '1',
        per_page: 20,
        recordsFiltered: '1',
        recordsTotal: '1',
      };

      service.loadEmailList(imapId, folderId, page, query)
        .subscribe(res => {

          expect(res.constructor).toEqual(MailboxListModel);
          expect(res.totalCount).toBe(parseInt(response.recordsTotal, 10));
          expect(res.folders[0].constructor).toEqual(FolderModel);
          expect(res.emails[0].constructor).toEqual(MailboxModel);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mailboxEmailList));

      expect(request.request.method).toBe('GET');
      request.flush(response);
    });
  });

  describe('loadEmail()', () => {

    it('should return Observable<EmailLoadResponseInterface>', () => {

      const id = '5';
      const folderId = '50';

      const response = {
        attachments_list: [],
        contacts: [],
        id: '4115',
        text: '<!DOCTYPE html PUBLIC ...',
        mark_seen: false,
      };

      service.loadEmail(id, folderId)
        .subscribe(res => {

          expect(res.attachments_list.length).toBe(0);
          expect(res.mark_seen).toBeFalsy();
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mailboxEmailLoad));

      expect(request.request.method).toBe('GET');
      request.flush(response);
    });
  });

  describe('loadProperties()', () => {

    it('should return Observable<PropertySearchResponseInterface>', () => {

      const query = 'geneva';

      const response = [
        {
          city: 'Geneva',
          full_address: '46B - Geneva',
          line1: '46B',
          line2: '',
          line3: '',
          name: 'AL174 - Penthouse with terrace in Florissant',
          ref: '2512',
          reference: 'AL174',
        },
      ];

      service.loadProperties(query)
        .subscribe(res => {

          expect(res.length).toBe(1);
          expect(res[0].city).toBe('Geneva');
          expect(res[0]).toEqual(response[0]);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mailboxPropertySearch));

      expect(request.request.method).toBe('GET');
      request.flush(response);
    });
  });

  describe('loadPromotions()', () => {

    it('should return Observable<PromotionSearchResponseInterface>', () => {

      const query = 'promo';

      const response = {
        query: 'unit',
        suggestions: [
          {
            data: '2',
            name: 'Supreme Promo',
            value: 'Supreme Promo - S-001 - Geneva',
          },
          {
            data: '16',
            name: 'Promo A',
            value: 'Promo A',
          },
        ],
      };

      service.loadPromotions(query)
        .subscribe(res => {

          expect(res.query).toBe('unit');
          expect(res.suggestions[0].name).toBe('Supreme Promo');
          expect(res).toEqual(response);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mailboxPromotionSearch));

      expect(request.request.method).toBe('GET');
      request.flush(response);
    });
  });

  describe('loadContacts()', () => {

    it('should return Observable<ContactSearchResponseInterface>', () => {

      const query = 'promo';

      const response = [
          {
            agency_id: '1',
            contact_id: '97105',
            email: 'elon@tesla.com',
            firstname: 'Elon',
            language: 'en',
            lastname: 'Musk',
            search: 'Musk | elon@tesla.com',
          },
        ];

      service.loadContacts(query)
        .subscribe(res => {

          expect(res.length).toBe(1);
          expect(res[0].contact_id).toBe('97105');
          expect(res).toEqual(response);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mailboxContactSearch));

      expect(request.request.method).toBe('GET');
      request.flush(response);
    });
  });

  describe('linkProperty()', () => {

    it('should return Observable<PropertyLinkResponseInterface>', () => {

      const emailId = 'hello@exampole.com';
      const propertyId = '123';

      const response = {
        msg: 'Example',
        success: true,
      };

      service.linkProperty(emailId, propertyId)
        .subscribe(res => {

          expect(res.msg).toBe('Example');
          expect(res.success).toBeTruthy();
          expect(res).toEqual(response);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mailboxPropertyLink));

      expect(request.request.method).toBe('POST');
      request.flush(response);
    });
  });

  describe('unlinkProperty()', () => {

    it('should return Observable<PropertyUnlinkResponseInterface>', () => {

      const emailId = 'hello@exampole.com';
      const propertyId = '123';

      const response = {
        msg: 'Example',
        success: true,
      };

      service.unlinkProperty(emailId, propertyId)
        .subscribe(res => {

          expect(res.msg).toBe('Example');
          expect(res.success).toBeTruthy();
          expect(res).toEqual(response);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mailboxPropertyUnlink));

      expect(request.request.method).toBe('POST');
      request.flush(response);
    });
  });

  describe('linkPromotion()', () => {

    it('should return Observable<PromotionLinkResponseInterface>', () => {

      const emailId = 'hello@exampole.com';
      const promotionId = '123';

      const response = {
        msg: 'Example',
        success: true,
      };

      service.linkPromotion(emailId, promotionId)
        .subscribe(res => {

          expect(res.msg).toBe('Example');
          expect(res.success).toBeTruthy();
          expect(res).toEqual(response);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mailboxPromotionLink));

      expect(request.request.method).toBe('POST');
      request.flush(response);
    });
  });

  describe('unlinkPromotion()', () => {

    it('should return Observable<PromotionUnlinkResponseInterface>', () => {

      const emailId = 'hello@exampole.com';
      const promotionId = '123';

      const response = {
        msg: 'Example',
        success: true,
      };

      service.unlinkPromotion(emailId, promotionId)
        .subscribe(res => {

          expect(res.msg).toBe('Example');
          expect(res.success).toBeTruthy();
          expect(res).toEqual(response);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mailboxPromotionUnlink));

      expect(request.request.method).toBe('POST');
      request.flush(response);
    });
  });

  describe('linkContact()', () => {

    it('should return Observable<ContactLinkResponseInterface>', () => {

      const emailId = 'hello@exampole.com';
      const contactId = '123';

      const response = {
        msg: 'Example',
        success: true,
      };

      service.linkContact(emailId, contactId)
        .subscribe(res => {

          expect(res.msg).toBe('Example');
          expect(res.success).toBeTruthy();
          expect(res).toEqual(response);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mailboxContactLink));

      expect(request.request.method).toBe('POST');
      request.flush(response);
    });
  });

  describe('unlinkContact()', () => {

    it('should return Observable<ContactUnlinkResponseInterface>', () => {

      const emailId = 'hello@exampole.com';
      const contactId = '123';

      const response = {
        msg: 'Example',
        success: true,
      };

      service.unlinkContact(emailId, contactId)
        .subscribe(res => {

          expect(res.msg).toBe('Example');
          expect(res.success).toBeTruthy();
          expect(res).toEqual(response);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mailboxContactUnlink));

      expect(request.request.method).toBe('POST');
      request.flush(response);
    });
  });

  describe('saveImapSettings()', () => {

    it('should return Observable<SettingsImapSaveResponseInterface>', () => {

      const data = {
        email: 'elon@tesla.com',
        password: 'pwd123',
        'imap-server': 'imap.tesla.com',
        'imap-port': '993',
        store_password: false,
        no_ssl: 0,
        novalidate_cert: 1,
      };

      const response = {
        data: {
          email: 'elon@tesla.com',
          no_ssl: 0,
          novalidate_cert: 1,
          password: null,
          save_password: 0,
          server_name: 'imap.tesla.com',
          server_port: '993',
        },
        msg: [],
        success: true,
      };

      service.saveImapSettings(data)
        .subscribe(res => {

          expect(res.data.email).toBe('elon@tesla.com');
          expect(res.msg.length).toBe(0);
          expect(res).toEqual(response);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mailboxSettingsSave));

      expect(request.request.method).toBe('POST');
      request.flush(response);
    });
  });

  describe('loadDomainSettings()', () => {

    it('should return Observable<SettingsDomainLoadResponseInterface>', () => {

      const email = 'hello@example.com';

      const response = {
        status: 1,
        data: {
          server_name: 'abc',
          server_port: '5000',
        },
      };

      service.loadDomainSettings(email)
        .subscribe(res => {

          expect(res.status).toBe(1);
          expect(res.data.server_name).toBe('abc');
          expect(res).toEqual(response);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mailboxSettingsDomainLoad));

      expect(request.request.method).toBe('GET');
      request.flush(response);
    });
  });

  describe('syncEmails()', () => {

    it('should return Observable<SyncEmailsResponseInterface>', () => {

      const response = {
        success: true,
        time: 12345,
      };

      service.syncEmails()
        .subscribe(res => {

          expect(res.success).toBeTruthy();
          expect(res.time).toBe(12345);
          expect(res).toEqual(response);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mailboxSync));

      expect(request.request.method).toBe('GET');
      request.flush(response);
    });
  });

  describe('loadEmailThreaded()', () => {

    it('should return Observable<EmailThreadedResponseInterface>', () => {

      const emailId = 'hello@exampole.com';
      const imapId = '5';

      const response = {
        prev: '',
        next: '',
        threads: [],
      };

      service.loadEmailThreaded(emailId, imapId)
        .subscribe(res => {

          expect(res.prev).toEqual(response.prev);
          expect(res.threads).toEqual(response.threads);
          expect(res).toEqual(response);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mailboxEmailThreaded));

      expect(request.request.method).toBe('GET');
      request.flush(response);
    });
  });

  describe('updateEmailSeen()', () => {

    it('should return Observable<EmailSeenResponseInterface>', () => {

      const emailId = 'hello@exampole.com';

      const response = {
        success: true,
      };

      service.updateEmailSeen(emailId)
        .subscribe(res => {

          expect(res.success).toBeTruthy();
          expect(res).toEqual(response);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mailboxEmailSeen.replace('{id}', '')));

      expect(request.request.method).toBe('POST');
      request.flush(response);
    });
  });

  describe('updateEmailUnseen()', () => {

    it('should return Observable<EmailUnseenResponseInterface>', () => {

      const emailIds = ['hello@exampole.com'];

      const response = {
        success: true,
      };

      service.updateEmailUnseen(emailIds)
        .subscribe(res => {

          expect(res.success).toBeTruthy();
          expect(res).toEqual(response);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mailboxEmailUnseen));

      expect(request.request.method).toBe('GET');
      request.flush(response);
    });
  });

  describe('deleteEmail()', () => {

    it('should return Observable<EmailDeleteResponseInterface>', () => {

      const emailIds = ['hello@exampole.com'];

      const response = {
        success: true,
      };

      service.deleteEmail(emailIds)
        .subscribe(res => {

          expect(res.success).toBeTruthy();
          expect(res).toEqual(response);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mailboxEmailDelete));

      expect(request.request.method).toBe('GET');
      request.flush(response);
    });
  });
});
