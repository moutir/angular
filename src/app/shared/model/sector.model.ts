import { ModelAbstract } from '../class/model.abstract';
import { LocationModel } from './location.model';
import { ContactModel } from './contact.model';
import { GeolocPolygonInterface } from '../interface/geoloc-polygon.interface';

export class SectorModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'locations',
    'createContact',
    'updateContact',
  ];

  id: string = '';
  name: string = '';
  locations: LocationModel[] = [];
  polygons: GeolocPolygonInterface[] = [];
  createContact: ContactModel = new ContactModel();
  createDate: Date|null = null;
  updateContact: ContactModel = new ContactModel();
  updateDate: Date|null = null;
}
