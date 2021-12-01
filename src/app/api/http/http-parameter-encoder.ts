import { HttpParameterCodec } from '@angular/common/http';

export class HttpParameterEncoder implements HttpParameterCodec {

  /**
   * Encode key
   */
  encodeKey(key: string): string {

    return encodeURIComponent(key);
  }

  /**
   * Encode value
   */
  encodeValue(value: string): string {

    return encodeURIComponent(value);
  }

  /**
   * Decode key
   */
  decodeKey(key: string): string {

    return decodeURIComponent(key);
  }

  /**
   * Decode value
   */
  decodeValue(value: string): string {

    return decodeURIComponent(value);
  }
}
