import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appAsyncImage]',
})
export class AsyncImageDirective implements AfterViewInit {

  /**
   * Image URL
   */
  @Input() appAsyncImage: string;

  /**
   * What strategy to apply ?
   * - `src`: will update `element.src` with image URL
   * - `background`: will update `element.style.backgroundImage` with image URL
   */
  @Input() appAsyncImageStrategy: 'src' | 'background' = 'background';

  /**
   * CSS class to apply automatically
   */
  private cssClass: string = 'rf__async-image';

  /**
   * CSS class to apply upon successful loading
   */
  private cssClassSuccess: string = 'rf__async-image--success';

  /**
   * CSS class to apply upon failed loading
   */
  private cssClassFailure: string = 'rf__async-image--failure';

  /**
   * Constructor
   */
  constructor(private el: ElementRef) {

  }

  /**
   * After initialized view
   */
  ngAfterViewInit(): void {

    // Add default CSS class to host element
    this.el.nativeElement.classList.add(this.cssClass);

    this.canLazyLoad() ? this.lazyLoadImage() : this.loadImage();
  }

  /**
   * Is lazy loading supported by the browser ?
   */
  private canLazyLoad(): boolean {

    return window && 'IntersectionObserver' in window;
  }

  /**
   * Lazy load image once it enters the viewport
   */
  private lazyLoadImage(): void {

    const intersectionObserver = new IntersectionObserver(entries => {

      entries.forEach(({ isIntersecting }) => {

        // Entered the viewport
        if (isIntersecting === true) {

          // Load image
          this.loadImage();

          // Unbind event
          intersectionObserver.unobserve(this.el.nativeElement);
        }
      });
    });

    // Bind event
    intersectionObserver.observe(this.el.nativeElement);
  }

  /**
   * Load image asynchronously
   */
  private loadImage(): void {

    const image = new Image();

    // Bind events
    image.onload = () => this.onLoad();
    image.onerror = () => this.onError();

    // Start loading
    image.src = this.appAsyncImage;
  }

  /**
   * Succeeded to load image URL
   */
  private onLoad(): void {

    // Add success CSS class to host element on next cycle
    setTimeout(() => this.el.nativeElement.classList.add(this.cssClassSuccess));

    // Strategy 'src'
    if (this.appAsyncImageStrategy === 'src') {

      this.el.nativeElement.src = this.appAsyncImage;
      return;
    }

    // Strategy 'background'
    if (this.appAsyncImageStrategy === 'background') {

      this.el.nativeElement.style.backgroundImage = 'url(' + this.appAsyncImage + ')';
      return;
    }
  }

  /**
   * Failed to load image URL
   */
  private onError(): void {

    // Add failure CSS class to host element
    this.el.nativeElement.classList.add(this.cssClassFailure);
  }
}
