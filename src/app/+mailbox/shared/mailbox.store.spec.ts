import { ReplaySubject } from 'rxjs';

import { MailboxStore } from './mailbox.store';
import { MailboxListState } from './mailbox-list.state';
import { ImapSettingsModel } from './imap-settings.model';

describe('MailboxStore', () => {
  let store: MailboxStore;

  beforeEach(() => {

    store = new MailboxStore();
  });

  describe('constructor()', () => {

    it('should set default values', () => {
      store = new MailboxStore();

      expect(store['emailListState']).toEqual(new ReplaySubject<MailboxListState>(1));
      expect(store['imapSettings']).toEqual(new ReplaySubject<ImapSettingsModel>(1));
      expect(store.emailListState$).toEqual(new ReplaySubject<MailboxListState>(1).asObservable());
      expect(store.imapSettings$).toEqual(new ReplaySubject<ImapSettingsModel>(1).asObservable());
    });
  });

  describe('setImapSettings()', () => {

    it('should call the imap settings subject next and set the passed values for user', (() => {
      const spy = spyOn(store['imapSettings'], 'next');
      const imapSettings = new ImapSettingsModel();

      store.setImapSettings(imapSettings);
      expect(spy).toHaveBeenCalled();
      expect(spy.calls.argsFor(0)[0]).toBe(imapSettings);
    }));
  });

  describe('setEmailListState()', () => {

    it('should call the user email state next and set the passed values for user', (() => {
      const spy = spyOn(store['emailListState'], 'next');
      const emailListState = new MailboxListState();

      store.setEmailListState(emailListState);
      expect(spy).toHaveBeenCalled();
      expect(spy.calls.argsFor(0)[0]).toBe(emailListState);
    }));
  });
});
