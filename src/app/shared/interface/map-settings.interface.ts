import { GeolocCoordinatesInterface } from './geoloc-coordinates.interface';

export interface MapSettingsInterface {

  // Map center coordinates
  centerCoordinates: GeolocCoordinatesInterface;

  // Zoom percentage
  zoomPercentage: number;
}
