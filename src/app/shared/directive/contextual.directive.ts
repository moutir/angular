import { AfterViewInit, Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

import { BrowserService } from '../../core/shared/browser/browser.service';
import { ContextualInterface } from '../interface/contextual.interface';

@Directive({
  selector: '[appContextual]',
})
export class ContextualDirective implements AfterViewInit, OnChanges {

  /**
   * Contextual element settings
   */
  @Input() appContextual: ContextualInterface;

  /**
   * CSS class to apply automatically
   */
  private cssClass: string = 'rf__contextual';

  /**
   * Number of pixels to move the contextual element on X & Y axis
   */
  private positionDelta: number = -30;

  /**
   * Number of pixels to consider as padding for the viewport on X & Y axis
   */
  private viewportPadding: number = 20;

  /**
   * Constructor
   */
  constructor(
    private el: ElementRef,
    private browserService: BrowserService,
  ) {

  }

  /**
   * After initialized view
   */
  ngAfterViewInit(): void {

    // Add CSS class to host element
    this.el.nativeElement.classList.add(this.cssClass);
  }

  /**
   * Changed input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (!this.appContextual.uid) {

      return;
    }

    // Set element's data-uid
    this.el.nativeElement.dataset.uid = this.appContextual.uid;

    // Reset element position (outside of the screen)
    this.el.nativeElement.style.left = '-10000px';
    this.el.nativeElement.style.top = '-10000px';

    // Next cycle
    setTimeout(() => {

      // Limit X and Y positions so that the content is always displayed within the viewport
      const size = this.el.nativeElement.getBoundingClientRect();
      const xLeftViewport = this.viewportPadding;
      const xLeft = this.appContextual.position.x + this.positionDelta;
      const xRightViewport = this.browserService.getWindowWidth() - this.viewportPadding;
      const xRight = xLeft + size.width;
      const yTopViewport = this.viewportPadding;
      const yTop = this.appContextual.position.y + this.positionDelta;
      const yBottomViewport = this.browserService.getWindowHeight() - this.viewportPadding;
      const yBottom = yTop + size.height;

      // Menu X & Y position
      let x = xLeft;
      let y = yTop;

      if (xLeft < xLeftViewport) {

        x = xLeftViewport;

      } else if (xRight > xRightViewport) {

        x = xRightViewport - size.width;
      }

      if (yTop < yTopViewport) {

        y = yTopViewport;

      } else if (yBottom > yBottomViewport) {

        y = yBottomViewport - size.height;
      }

      // Update element position
      this.el.nativeElement.style.left = x + 'px';
      this.el.nativeElement.style.top = y + 'px';
    });
  }
}
