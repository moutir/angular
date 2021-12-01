import { GeolocCoordinatesInterface } from './geoloc-coordinates.interface';

export interface GeolocMarkerInterface {
  coordinates: GeolocCoordinatesInterface;
  icon: string;
  title: string;
}
