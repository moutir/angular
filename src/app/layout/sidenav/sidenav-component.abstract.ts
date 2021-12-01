import { EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

export abstract class SidenavComponentAbstract implements OnChanges {

  /**
   * Is the sidenav visible ?
   */
  @Input() isVisible: boolean = false;

  /**
   * Is the sidenav loading ?
   */
  @Input() isLoading: boolean = true;

  /**
   * Closed sidenav
   */
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Material sidenav component
   */
  @ViewChild(MatSidenav, { static: false }) sidenav: MatSidenav;

  /**
   * Is the sidenav active ?
   */
  isActive: boolean = false;

  /**
   * Deactivation timeout
   */
  protected deactivationTimeout: number;

  /**
   * Deactivation delay (ms)
   */
  protected deactivationDelay: number = 300;

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    // Changed visibility
    if (this.sidenav && changes.isVisible) {

      changes.isVisible.currentValue === true ? this.activate() : this.deactivate();
    }
  }

  /**
   * Deactivate sidenav
   */
  deactivate(): void {

    if (this.isActive === false) {

      return;
    }

    this.sidenav.close();
    this.close.emit();

    this.deactivationTimeout = window.setTimeout(() => this.isActive = false, this.deactivationDelay);
  }

  /**
   * Activate sidenav
   */
  protected activate(): void {

    // Clear timeout
    if (this.deactivationTimeout) {

      clearTimeout(this.deactivationTimeout);
    }

    this.isVisible = true;
    this.isActive = true;

    this.sidenav.open();
  }
}
