import { GeolocPolygonInterface } from './geoloc-polygon.interface';

export interface MapPolygonListInterface {
  uid: string;
  polygons: Array<GeolocPolygonInterface>;
}
