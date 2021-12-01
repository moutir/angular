import { GeolocCoordinatesInterface } from '../../../shared/interface/geoloc-coordinates.interface';

export interface FisherLocationInterface {
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  coordinates: GeolocCoordinatesInterface;
}
