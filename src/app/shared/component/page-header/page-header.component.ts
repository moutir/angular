import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { ButtonTypeEnum } from '../../enum/button-type.enum';
import { ButtonInterface } from '../../interface/button.interface';
import { PageHeaderInterface } from '../../interface/page-header.interface';
import { ColorEnum } from '../../enum/color.enum';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ContextualInterface } from '../../interface/contextual.interface';
import { MenuItemInterface } from '../../interface/menu-item.interface';
import { BrowserService } from '../../../core/shared/browser/browser.service';
import { Dictionary } from '../../class/dictionary';

@Component({
  selector: 'app-shared-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent implements OnInit {

  /**
   * Header
   */
  @Input() header: PageHeaderInterface;

  /**
   * Click button
   */
  @Output() clickButton: EventEmitter<ButtonTypeEnum> = new EventEmitter<ButtonTypeEnum>();

  /**
   * Click menu item
   */
  @Output() clickMenuItem: EventEmitter<MenuItemInterface> = new EventEmitter<MenuItemInterface>();

  /**
   * UID
   */
  uid: string = 'page-header';

  /**
   * State observables
   */
  runtimeContextual$: Observable<ContextualInterface>;

  /**
   * Button dictionary
   */
  protected button: Dictionary<ButtonInterface> = {};

  /**
   * Constructor
   */
  constructor(
    protected runtimeService: RuntimeService,
    private browserService: BrowserService,
  ) {

    this.button[ButtonTypeEnum.add] = {
      type: ButtonTypeEnum.add,
      icon: 'add',
      label: 'page_header_button_add',
      color: ColorEnum.green,
    };

    this.button[ButtonTypeEnum.save] = {
      type: ButtonTypeEnum.save,
      icon: 'save',
      label: 'page_header_button_save',
      color: ColorEnum.green,
    };

    this.button[ButtonTypeEnum.cancel] = {
      type: ButtonTypeEnum.cancel,
      icon: 'undo',
      label: 'page_header_button_cancel',
      color: ColorEnum.gray,
    };

    this.button[ButtonTypeEnum.search] = {
      type: ButtonTypeEnum.search,
      icon: 'search',
      label: 'page_header_button_search',
      color: ColorEnum.default,
    };

    this.button[ButtonTypeEnum.searchSubmit] = {
      type: ButtonTypeEnum.searchSubmit,
      icon: 'search',
      label: 'page_header_button_search_submit',
      color: ColorEnum.green,
    };

    this.button[ButtonTypeEnum.menu] = {
      type: ButtonTypeEnum.menu,
      icon: 'more_vert',
      label: 'page_header_button_more',
      color: ColorEnum.default,
    };

    this.button[ButtonTypeEnum.send] = {
      type: ButtonTypeEnum.send,
      icon: 'send',
      label: 'page_header_button_send',
      color: ColorEnum.green,
    };

    this.button[ButtonTypeEnum.edit] = {
      type: ButtonTypeEnum.edit,
      icon: 'edit',
      label: 'page_header_button_edit',
      color: ColorEnum.green,
    };

    this.button[ButtonTypeEnum.preview] = {
      type: ButtonTypeEnum.preview,
      icon: 'find_in_page',
      label: 'page_header_button_preview',
      color: ColorEnum.default,
    };

    this.button[ButtonTypeEnum.sendInvite] = {
      type: ButtonTypeEnum.sendInvite,
      icon: 'send',
      label: 'page_header_button_send_invite',
      color: ColorEnum.green,
    };

    this.button[ButtonTypeEnum.uninvite] = {
      type: ButtonTypeEnum.uninvite,
      icon: 'block',
      label: 'page_header_button_uninvite',
      color: ColorEnum.red,
    };

    this.button[ButtonTypeEnum.accept] = {
      type: ButtonTypeEnum.accept,
      icon: 'check',
      label: 'page_header_button_accept',
      color: ColorEnum.green,
    };

    this.button[ButtonTypeEnum.reject] = {
      type: ButtonTypeEnum.reject,
      icon: 'close',
      label: 'page_header_button_reject',
      color: ColorEnum.red,
    };

    this.button[ButtonTypeEnum.terminate] = {
      type: ButtonTypeEnum.terminate,
      icon: 'block',
      label: 'page_header_button_terminate',
      color: ColorEnum.red,
    };
  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // State observable
    this.runtimeContextual$ = this.runtimeService.selectContextual();
  }

  /**
   * Clicked button
   */
  onClickButton(event: MouseEvent, button: ButtonInterface): void {

    event.preventDefault();
    event.stopPropagation();

    // Button is loading or disabled
    if (this.header.buttonsLoading.indexOf(button.type) > -1 || this.header.buttonsDisabled.indexOf(button.type) > -1) {

      return;
    }

    // Menu button
    if (button.type === ButtonTypeEnum.menu) {

      // Open contextual menu
      this.runtimeService.showContextual(this.uid, event.clientX, event.clientY);

      return;
    }

    this.clickButton.emit(button.type);
  }

  /**
   * Clicked a menu item
   */
  onClickMenuItem(menuItem: MenuItemInterface): void {

    this.clickMenuItem.emit(menuItem);
  }
}
