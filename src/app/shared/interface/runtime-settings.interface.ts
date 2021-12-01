import { AreaUnitEnum } from '../enum/area-unit.enum';
import { LanguageEnum } from '../enum/language.enum';
import { KeyValueType } from '../type/key-value.type';
import { PolygonSettingsInterface } from './polygon-settings.interface';
import { MapSettingsInterface } from './map-settings.interface';

export interface RuntimeSettingsInterface {

  // Number of records per page available options
  perPage: number[];

  // Language settings
  language: {
    current: LanguageEnum;
    available: KeyValueType<LanguageEnum, string>;
  };

  // Map settings
  map: MapSettingsInterface;

  // Polygon settings
  polygon: PolygonSettingsInterface;

  // Currency
  currency: string;

  // Area unit
  areaUnit: AreaUnitEnum;

  // Export limit
  exportLimit: number;

  // Email limit
  emailLimit: number;
}
