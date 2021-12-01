import { GeolocCoordinatesInterface } from './geoloc-coordinates.interface';

export interface GeolocViewportInterface {
  topLeft: GeolocCoordinatesInterface;
  topRight: GeolocCoordinatesInterface;
  bottomRight: GeolocCoordinatesInterface;
  bottomLeft: GeolocCoordinatesInterface;
}
