import { TestBed } from '@angular/core/testing';

import { LayoutService } from './layout.service';
import { BrowserServiceMock } from '../../core/shared/browser/browser.service.mock';
import { BrowserService } from '../../core/shared/browser/browser.service';

describe('LayoutService', () => {

  let service: LayoutService;
  let browserService: BrowserService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
      ],
      providers: [
        LayoutService,
        { provide: BrowserService, useClass: BrowserServiceMock },
      ],
    });

    service = TestBed.get(LayoutService);
    browserService = TestBed.get(BrowserService);
  });

  describe('updateLegacyContent()', () => {

    it('should update the legacy HTML element content', () => {

      service.updateLegacyContent();

      expect(browserService.querySelector('#legacy').innerHTML).toEqual('');
    });
  });

  describe('updateLegacyBody()', () => {

    it('should Update legacy <body>', () => {

      service.updateLegacyBody('left', true);

      expect(browserService.querySelector('body').innerHTML).toEqual('');
    });
  });
});
