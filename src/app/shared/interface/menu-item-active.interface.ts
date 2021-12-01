import { MenuItemInterface } from './menu-item.interface';

export interface MenuItemActiveInterface {
  menuItem: MenuItemInterface;
  position: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}
