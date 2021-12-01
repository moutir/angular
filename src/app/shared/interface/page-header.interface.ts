import { ButtonTypeEnum } from '../enum/button-type.enum';
import { MenuInterface } from './menu.interface';

export interface PageHeaderInterface {

  /**
   * Icon
   */
  icon: string;

  /**
   * Title (not translated)
   */
  title: string;

  /**
   * Subtitle (not translated)
   */
  subtitles: string[];

  /**
   * Buttons in display order from left to right
   */
  buttons: ButtonTypeEnum[];

  /**
   * Buttons in loading state
   */
  buttonsLoading: ButtonTypeEnum[];

  /**
   * Buttons in disabled state
   */
  buttonsDisabled: ButtonTypeEnum[];

  /**
   * Menu behind the "menu" button
   */
  menu: MenuInterface;
}
