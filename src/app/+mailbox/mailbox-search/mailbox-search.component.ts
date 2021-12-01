import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-mailbox-search',
  templateUrl: './mailbox-search.component.html',
  styleUrls: ['./mailbox-search.component.scss'],
})
export class MailboxSearchComponent {

  @Input() needle: '';
  @Input() delay: number = 250;
  @Output() notify: EventEmitter<any> = new EventEmitter();

  constructor(private elementRef: ElementRef) {

    const eventStream = fromEvent(elementRef.nativeElement, 'keyup')
      .pipe(
        map(() => this.needle),
        debounceTime(this.delay),
        distinctUntilChanged(),
      );

    eventStream.subscribe(term => this.search(term));
  }

  search(term: string) {

    this.notify.emit(term);
  }

  onClickClear(): void {

    this.needle = '';
    this.search('');
  }
}
