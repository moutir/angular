import { GeolocCoordinatesInterface } from './geoloc-coordinates.interface';

export interface AddressInterface {
  string: string;
  houseNumber: string;
  street: string;
  city: string;
  zipCode: string;
  coordinates: GeolocCoordinatesInterface;
}
