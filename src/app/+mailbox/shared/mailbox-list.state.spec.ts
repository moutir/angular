import { MailboxListState } from './mailbox-list.state';

describe('EmailListState', () => {
  let state: MailboxListState;

  beforeEach(() => {

    state = new MailboxListState();

    // Mock data
    state.page = 2;
    state.folderId = '9';
    state.searchQuery = 'test';
  });

  describe('constructor()', () => {

    it('should set default values', () => {
      state = new MailboxListState();

      expect(state.page).toEqual(1);
      expect(state.folderId).toEqual('');
      expect(state.searchQuery).toEqual('');
    });
  });

  describe('clone()', () => {

    it('should create exact copy of all values and references of email list state', () => {
      expect(state.clone()).toEqual(state);
    });
  });
});
