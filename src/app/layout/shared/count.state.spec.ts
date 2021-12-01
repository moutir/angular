import { CountState } from './count.state';

describe('CountState', () => {
  let state: CountState;

  beforeEach(() => {

    state = new CountState();
  });

  describe('constructor()', () => {

    it('should set default values', () => {
      state = new CountState();

      expect(state.matchingContactCount).toEqual(0);
      expect(state.matchingPropertyCount).toEqual(0);
      expect(state.matchingPromotionCount).toEqual(0);
      expect(state.leadCount).toEqual(0);
      expect(state.mailboxCount).toEqual(0);
    });
  });
});
