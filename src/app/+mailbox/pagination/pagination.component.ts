import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { PaginationService } from '../shared/pagination.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  providers: [PaginationService],
})
export class PaginationComponent implements OnInit {

  @Input() totalPages: number;
  @Input() currentPage: number;
  @Input() prev;
  @Input() next;
  @Output() notify: EventEmitter<any> = new EventEmitter();
  @Output() notify_thread: EventEmitter<any> = new EventEmitter();

  private pageIndex: number;

  ngOnInit(): void {
    this.pageIndex = this.currentPage;
  }

  prevPage() {
    this.pageIndex = this.currentPage;
    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.notify.emit(this.pageIndex);
    }
    this.notify_thread.emit(false);
  }

  nextPage() {
    this.pageIndex = this.currentPage;
    if (this.pageIndex < this.totalPages || !this.totalPages) {
      this.pageIndex++;
      this.notify.emit(this.pageIndex);
    }
    this.notify_thread.emit(true);
  }
}
