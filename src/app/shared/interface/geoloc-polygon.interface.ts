import { GeolocVertexInterface } from './geoloc-vertex.interface';

export interface GeolocPolygonInterface {
  id: string;
  color: string;
  vertices: GeolocVertexInterface[];
}
