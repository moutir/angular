import { WindowInterface } from '../../../shared/interface/window.interface';
import { BrowserService } from './browser.service';

describe('BrowserService', () => {

  let browserService: BrowserService;

  beforeEach(() => {

    browserService = new BrowserService();
  });

  describe('setWindow()', () => {

    it('should set window', () => {

      const window = <WindowInterface>{};

      browserService.setWindow(window);

      expect(browserService.getWindow()).toEqual(window);
    });
  });

  describe('getWindow()', () => {

    it('should return WindowInterface', () => {

      const window = <WindowInterface>{};

      browserService.setWindow(window);

      expect(browserService.getWindow()).toEqual(window);
    });
  });

  describe('getRealforceConfig()', () => {

    it('should return RealforceConfigInterface<ConfigClass>', () => {

      const spy = spyOn(browserService, 'getWindow').and.returnValue({
        realforce: {
          config: {},
        },
      });

      const config = browserService.getRealforceConfig();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(config).toEqual({});
    });
  });

  describe('querySelector()', () => {

    it('should select the selector from parent selector or root', () => {

      const selector = '#button';

      const spy = spyOn(document, 'querySelector').and.callFake(sel => sel);

      const getWindowSpy = spyOn(browserService, 'getWindow').and.returnValue({ document });

      browserService.querySelector(selector);

      expect(getWindowSpy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(selector);
    });
  });

  describe('getScrollY()', () => {

    it('should return the pageYOffset position', () => {

      const window = <WindowInterface>{ pageYOffset: 200 };

      browserService.setWindow(window);

      expect(browserService.getScrollY()).toBe(200);
    });
  });

  describe('getWindowWidth()', () => {

    it('should return the window inner width', () => {

      const window = <WindowInterface>{ innerWidth: 500 };

      browserService.setWindow(window);

      expect(browserService.getWindowWidth()).toBe(500);
    });
  });

  describe('getWindowHeight()', () => {

    it('should return the window inner height', () => {

      const window = <WindowInterface>{ innerHeight: 500 };

      browserService.setWindow(window);

      expect(browserService.getWindowHeight()).toBe(500);
    });
  });

  describe('getBodyHeight()', () => {

    it('should return the body height', () => {

      const window = <WindowInterface>{
        document: {
          body: {
            clientHeight: 500,
          },
        },
      };

      browserService.setWindow(window);

      expect(browserService.getBodyHeight()).toBe(500);
    });
  });

  describe('reload()', () => {

    it('should reload current URL', () => {

      const window = <WindowInterface>{
        location: {
          reload: () => {},
        },
      };

      const spy = spyOn(window.location, 'reload').and.callFake(() => true);

      browserService.setWindow(window);
      browserService.reload();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('redirect()', () => {

    it('should redirect to URL', () => {

      const window = <WindowInterface>{
        location: {
          href: '',
        },
      };

      browserService.setWindow(window);
      browserService.redirect('/myUrl');

      expect(window.location.href).toEqual('/myUrl');
    });
  });

  describe('blank()', () => {

    it('should open URL in _blank', () => {

      const window = <WindowInterface>{
        open: () => {},
      };

      const spy = spyOn(window, 'open').and.callFake(() => true);

      browserService.setWindow(window);
      browserService.blank('/myUrl');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('/myUrl', '_blank');
    });
  });
});
