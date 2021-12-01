import { StorageAbstract } from './storage.abstract';
import { LocalStorageEnum } from '../../../shared/enum/local-storage.enum';
import { StorageMock } from './storage.mock';

describe('StorageAbstract', () => {

  // Have to define a concrete class if we want to test an abstract class
  class LocalStorageService extends StorageAbstract<LocalStorageEnum> {}

  let localStorageService: LocalStorageService;
  let storageMock: Storage;

  beforeEach(() => {

    storageMock = StorageMock();
    localStorageService = new LocalStorageService(storageMock);
  });

  describe('setItem()', () => {

    it('should call storageMock.setItem()', () => {

      localStorageService.setItem(LocalStorageEnum.navigationFold, 'true');

      expect(storageMock.setItem).toHaveBeenCalledTimes(1);
      expect(storageMock.setItem).toHaveBeenCalledWith(LocalStorageEnum.navigationFold, 'true');
    });
  });

  describe('getItem()', () => {

    it('should call storageMock.getItem()', () => {

      localStorageService.getItem(LocalStorageEnum.navigationFold);

      expect(storageMock.getItem).toHaveBeenCalledTimes(1);
      expect(storageMock.getItem).toHaveBeenCalledWith(LocalStorageEnum.navigationFold);
    });
  });

  describe('removeItem()', () => {

    it('should call storageMock.removeItem()', () => {

      localStorageService.removeItem(LocalStorageEnum.navigationFold);

      expect(storageMock.removeItem).toHaveBeenCalledTimes(1);
      expect(storageMock.removeItem).toHaveBeenCalledWith(LocalStorageEnum.navigationFold);
    });
  });

  describe('clear()', () => {

    it('should call storageMock.clear()', () => {

      localStorageService.clear();

      expect(storageMock.clear).toHaveBeenCalledTimes(1);
    });
  });
});
