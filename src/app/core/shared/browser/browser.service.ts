import { Injectable } from '@angular/core';
import { Dictionary } from 'app/shared/class/dictionary';

import { WindowInterface } from '../../../shared/interface/window.interface';
import { RealforceConfigInterface } from '../../../shared/interface/realforce.interface';

/**
 * Only class allowed to access & manipulate the global variable 'window'.
 */
@Injectable()
export class BrowserService {

  /**
   * Realforce window object
   */
  private window: WindowInterface;

  /**
   * Set the realforce window object
   */
  setWindow(window: WindowInterface): void {

    this.window = window;
  }

  /**
   * Return the realforce window object
   */
  getWindow(): WindowInterface {

    if (!this.window) {

      throw new Error('BrowserService.window is not defined! Please call BrowserService.setWindow() first.');
    }

    return this.window;
  }

  /**
   * Return realforce config
   */
  getRealforceConfig<ConfigClass>(): RealforceConfigInterface<ConfigClass> {

    return <RealforceConfigInterface<ConfigClass>>this.getWindow().realforce.config;
  }

  /**
   * Scroll to window to @x and @y coordinates in @duration milliseconds
   */
  scrollTo(x: number, y: number, duration: number): void {

    const startX = window.pageXOffset;
    const startY = window.pageYOffset;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

    /**
     * Easing function
     */
    const easeOutCubic = (t) => (--t) * t * t + 1;

    /**
     * Scroll main loop
     */
    const scroll = () => {

      const now = 'now' in window.performance ? performance.now() : new Date().getTime();
      const time = Math.min(1, ((now - startTime) / duration));

      window.scroll(
        Math.ceil((easeOutCubic(time) * (x - startX)) + startX),
        Math.ceil((easeOutCubic(time) * (y - startY)) + startY),
      );

      if (window.pageXOffset === x && window.pageYOffset === y) {

        return;
      }

      requestAnimationFrame(scroll);
    };

    scroll();
  }

  /**
   * Return an Element identified by @cssSelector, that is a child of @parentElement.
   * If no parent is provided, window.document will be used instead.
   */
  querySelector(cssSelector: string, parentElement?: Element): Element|null {

    const root: Document|Element = parentElement || this.getWindow().document;

    return root.querySelector(cssSelector);
  }

  /**
   * Return the window current scroll Y
   */
  getScrollY(): number {

    return this.window.pageYOffset;
  }

  /**
   * Return the window inner width
   */
  getWindowWidth(): number {

    return this.window.innerWidth;
  }

  /**
   * Return the window inner height
   */
  getWindowHeight(): number {

    return this.window.innerHeight;
  }

  /**
   * Return the body height
   */
  getBodyHeight(): number {

    return this.getWindow().document.body.clientHeight;
  }

  /**
   * Reload current URL
   */
  reload(): void {

    return this.getWindow().location.reload();
  }

  /**
   * Redirect to URL
   */
  redirect(url: string): void {

    this.getWindow().location.href = url;
  }

  /**
   * Open URL in _blank
   */
  blank(url: string): void {

    this.getWindow().open(url, '_blank');
  }

  /**
   * Open URL in _blank with POST method
   */
  blankPost(
    url: string,
    params: Dictionary<string|number|string[]|number[]> = {},
  ): void {

    let input: HTMLInputElement;
    const doc = this.getWindow().document;
    const form = doc.createElement('form');

    form.setAttribute('method', 'POST');
    form.setAttribute('action', url);
    form.setAttribute('target', '_blank');

    Object
      .keys(params)
      .forEach(key => {

        if (Array.isArray(params[key])) {

          (<string[]>params[key]).forEach(value => {

            input = doc.createElement('input');
            input.type = 'hidden';
            input.name = key + '[]';
            input.value = value;
            form.appendChild(input);
          });

          return;
        }

        input = doc.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = <string>params[key];
        form.appendChild(input);
      });

    doc.body.appendChild(form);
    form.submit();
    doc.body.removeChild(form);
  }

  /**
   * Trigger an event on the window object
   */
  triggerEvent(eventName: string): void {

    this.window.dispatchEvent(
      new Event(eventName),
    );
  }
}
