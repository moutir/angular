import { MenuInterface } from './menu.interface';

export interface MenuItemInterface extends MenuInterface {
  id: string;
  label: string; // considered NOT translated
  icon: string;
  tooltip: string;
  isEnabled: boolean;
}
