import { EventEmitter } from '@angular/core';

import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  let state: PaginationService;

  beforeEach(() => {

    state = new PaginationService();
  });

  describe('pageIndex()', () => {

    it('getter should be able to get value', () => {

      expect(state.pageIndex).toBeUndefined();
    });

    it('setter should be able to set value', () => {

      state.pageIndex = 1;

      expect(state.pageIndex).toEqual(1);
    });
  });

  describe('getIndex()', () => {

    it('should return page index', () => {

      state.setIndex(2);

      expect(state.getIndex()).toEqual(2);
    });
  });

  describe('setIndex()', () => {

    it('should set page index', () => {

      state.setIndex(1);

      expect(state.pageIndex).toEqual(1);
    });
  });

  describe('getEmittedValue()', () => {

    it('should return event emitter', () => {
      expect(state.getEmittedValue()).toEqual(new EventEmitter());
    });
  });
});
