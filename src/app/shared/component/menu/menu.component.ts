import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { MenuInterface } from '../../interface/menu.interface';
import { MenuItemInterface } from '../../interface/menu-item.interface';
import { BrowserService } from '../../../core/shared/browser/browser.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';

@Component({
  selector: 'app-shared-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {

  /**
   * Menu definition
   */
  @Input() menu: MenuInterface;

  /**
   * Clicked a menu item
   */
  @Output() clickMenuItem: EventEmitter<MenuItemInterface> = new EventEmitter<MenuItemInterface>();

  /**
   * Active menu item
   */
  activeItem: MenuItemInterface|null = null;

  /**
   * Number of margin pixels to apply to child menu's position
   */
  childMargin: number = 8;

  /**
   * Style to apply to child menu
   */
  childStyle: {
    left: string;
    top: string;
  } = {
    left: '100%',
    top: '100%',
  };

  /**
   * Reference on the child menu
   */
  @ViewChild(MenuComponent, { static: false }) childMenu: MenuComponent;

  /**
   * Constructor
   */
  constructor(
    private el: ElementRef,
    private browserService: BrowserService,
    private runtimeService: RuntimeService,
  ) {

  }

  /**
   * Clicked a menu item
   */
  onClickMenuItem(menuItem: MenuItemInterface): void {

    if (!menuItem.isEnabled) {

      return;
    }

    this.clickMenuItem.emit(menuItem);
    this.runtimeService.hideContextual();
  }

  /**
   * Mouse over a menu item
   */
  onMouseOverMenuItem(event: MouseEvent, menuItem: MenuItemInterface): void {

    // Update active menu
    this.activeItem = menuItem;
    this.childStyle = {
      left: '100%',
      top: '100%',
    };

    // Keep size of parent element
    const size = (<Element>event.currentTarget).getBoundingClientRect();

    // Update child style on next cycle
    setTimeout(() => this.updateChildStyle(size.width, size.height, size.left, size.top));
  }

  /**
   * Update menu child style so it always fits within viewport and stuck to the parent menu
   */
  private updateChildStyle(parentWidth: number, parentHeight: number, parentLeft: number, parentTop: number): void {

    const childSize = this.childMenu.el.nativeElement.getBoundingClientRect();
    const width = childSize.width;
    const height = childSize.height;
    const left = parentLeft + parentWidth - this.childMargin; // Default position at the right of the parent
    const top = parentTop - this.childMargin; // Default position at the top of the parent

    // Reset child style
    this.childStyle = {
      left: (left + width < this.browserService.getWindowWidth() ? left : parentLeft + this.childMargin - width) + 'px',
      top: (top + height < this.browserService.getWindowHeight() ? top : parentTop + parentHeight + this.childMargin - height) + 'px',
    };
  }
}
