import { ConfirmService } from './confirm.service';
import { Confirm } from '../../shared/class/confirm';

describe('ConfirmService', () => {

  let confirmService: ConfirmService;

  beforeEach(() => {

    confirmService = new ConfirmService();
  });

  describe('constructor()', () => {

    it('should set default values', () => {

      expect(confirmService['confirm$']).toBeDefined();
    });
  });

  describe('selectConfirm()', () => {

    it('should return Observable<Confirm>', () => {

      confirmService.selectConfirm()
        .subscribe(model => {

          expect(model instanceof Confirm).toBeTruthy();
        })
      ;

      expect(confirmService.selectConfirm()).toEqual(confirmService['confirm$']);
    });
  });

  describe('message()', () => {

    it('should open confirm modal', () => {

      const message = 'Hello world';

      confirmService.selectConfirm()
        .subscribe(confirm => {

          expect(confirm.message).toEqual(message);
        })
      ;

      confirmService.message(message)
        .subscribe(isValid => {

          expect(isValid).toBeDefined();
        })
      ;
    });
  });
});
