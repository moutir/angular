import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SymfonyHttpService } from '../../http/symfony-http.service';
import { ContactRecordInterface } from './contact-record.interface';

@Injectable()
export class ContactApiSymfonyService {

  /**
   * Constructor
   */
  constructor(
    private apiService: SymfonyHttpService,
  ) {

  }

  /**
   * Load record
   */
  load(id: string): Observable<ContactRecordInterface> {

    return this
      .apiService
      .get<{}, ContactRecordInterface>(
        '/api/contacts/{id}',
        {},
        { id },
      );
  }
}
