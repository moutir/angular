import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable()
export class PaginationService {

  @Output() fire: EventEmitter<any> = new EventEmitter();

  pageIndexValue;

  constructor() {
  }

  get pageIndex() {
    return this.pageIndexValue;
  }

  set pageIndex(data: number) {
    this.pageIndexValue = data;
    this.fire.emit(this.pageIndexValue);
  }

  setIndex(data) {
    this.pageIndexValue = data;
  }

  getIndex() {
    return this.pageIndexValue;
  }

  getEmittedValue() {
    return this.fire;
  }
}
