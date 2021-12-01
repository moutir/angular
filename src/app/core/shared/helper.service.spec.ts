import { HelperService } from './helper.service';

describe('HelperService', () => {

  let service: HelperService;

  beforeEach(() => {

    service = new HelperService();
  });

  describe('formatNumber()', () => {

    it('should return 50\'000 for input 50000', () => {

      expect(service.formatNumber(50000)).toBe('50\'000');
    });
  });

  describe('isNumeric()', () => {

    it('should return true for 100', () => {

      expect(service.isNumeric('100')).toBe(true);
    });

    it('should return false for 100ABC', () => {

      expect(service.isNumeric('100ABC')).toBe(false);
    });
  });

  describe('toCamelCase()', () => {

    it('should return value \'Inbox\' for input \'inbox\'', () => {

      expect(service.toCamelCase('inbox')).toBe('Inbox');
    });
  });
});
