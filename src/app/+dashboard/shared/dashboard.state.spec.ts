import { DashboardState } from './dashboard.state';
import { RoleEnum } from '../../shared/enum/role.enum';

describe('DashboardState', () => {
  let state: DashboardState;

  beforeEach(() => {

    state = new DashboardState();

    // Mock data
    state.roleId = 2;
    state.brokerIds = ['1', 'a', '3', '4'];
    state.brokerTypeId = '1';
    state.contactTypeId = 'p';
    state.transactionTypeId = '1';
  });

  describe('constructor()', () => {

    it('should set default values', () => {
      state = new DashboardState();

      expect(state.roleId).toEqual(RoleEnum.agent);
      expect(state.brokerIds).toEqual([]);
      expect(state.transactionTypeId).toEqual('');
      expect(state.contactTypeId).toEqual('');
      expect(state.brokerTypeId).toEqual('');
    });
  });

  describe('clone()', () => {

    it('should create exact copy of all values and references of dashboard state', () => {
      expect(state.clone()).toEqual(state);
    });
  });
});
