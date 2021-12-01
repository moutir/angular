import { Component, OnInit } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';

import { DocumentModel } from '../../shared/model/document.model';
import { DocumentManagerStrategyInterface } from '../../shared/interface/document-manager-strategy.interface';

@Component({
  selector: 'app-dummy-document-page',
  templateUrl: './dummy-document-page.component.html',
})
export class DummyDocumentPageComponent implements OnInit {

  /**
   * Documents list
   */
  document$: Observable<DocumentModel[]>;
  documents: ReplaySubject<DocumentModel[]> = new ReplaySubject<DocumentModel[]>();

  /**
   * Documents strategy
   */
  strategy$: Observable<DocumentManagerStrategyInterface>;

  /**
   * Constructor
   */
  constructor() {

    this.document$ = this.documents.asObservable();
  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.strategy$ = of({
      inputs: [
        {
          name: 'tag',
          type: 'text',
          label: 'label_tag',
          default: '',
        },
        {
          name: 'brochure',
          type: 'checkboxes',
          label: 'label_use_as_brochure',
          default: '',
          options: 'brochureLanguage',
        },
        {
          name: 'size',
          type: 'select',
          label: 'label_size_brochure',
          default: '',
          options: 'brochureSize',
        },
        {
          name: 'plan',
          type: 'checkbox',
          label: 'label_use_as_plan',
          default: false,
        },
      ],
      options: {
        brochureLanguage: [
          {
            value: '1',
            text: 'label_brochure_fr',
          },
          {
            value: '2',
            text: 'label_brochure_de',
          },
          {
            value: '3',
            text: 'label_brochure_en',
          },
          {
            value: '4',
            text: 'label_brochure_it',
          },
        ],
        brochureSize: [
          {
            value: '1',
            text: 'Pleine page',
          },
          {
            value: '2',
            text: 'Demie page',
          },
          {
            value: '3',
            text: 'Absent brochure',
          },
        ],
      },
    });

    const documents = [
      new DocumentModel(),
      new DocumentModel(),
      new DocumentModel(),
      new DocumentModel(),
      new DocumentModel(),
    ];

    documents[0].id = '1';
    documents[0].name = 'Photo with a very long title let\'s see how it behaves.jpg';
    documents[0].size = 234567;
    documents[0].fileUrl = 'https://www.theinvisibletourist.com/wp-content/uploads/2019/12/featured_130-770x600.jpg';
    documents[0].photoSmallURL = documents[0].fileUrl;
    documents[0].updateDate = new Date(2019, 2, 14);
    documents[0].data = {
      tag: 'I am a tag',
      brochure: [],
      size: '2',
      plan: true,
    };

    documents[1].id = '5';
    documents[1].name = 'city-view.png';
    documents[1].size = 2234567;
    documents[1].fileUrl = 'https://www.s-ge.com/sites/default/files/styles/sge_header_lg/public/article/images/geneva.jpeg?itok=zoLlDs0w';
    documents[1].photoSmallURL = documents[1].fileUrl;
    documents[1].updateDate = new Date(2020, 1, 21);
    documents[1].data = {
      tag: '',
      brochure: ['2'],
      size: '1',
      plan: false,
    };

    documents[2].id = '2';
    documents[2].name = 'document_2.pdf';
    documents[2].size = 2234567;
    documents[2].fileUrl = 'https://wow.olympus.eu/webfile/img/1632/oly_testwow_stage.jpg';
    documents[2].photoSmallURL = '';
    documents[2].updateDate = new Date(2020, 1, 21);
    documents[2].data = {
      tag: '',
      brochure: ['1', '4'],
      size: '',
      plan: true,
    };

    documents[3].id = '3';
    documents[3].name = 'document_3.docx';
    documents[3].size = 123467;
    documents[3].fileUrl = 'https://wow.olympus.eu/webfile/img/1632/oly_testwow_stage.jpg';
    documents[3].photoSmallURL = '';
    documents[3].updateDate = new Date(2020, 0, 3);
    documents[3].data = {
      tag: 'I am a tag',
      brochure: [],
      size: '2',
      plan: false,
    };

    documents[4].id = '4';
    documents[4].name = 'document_1.txt';
    documents[4].size = 5633454327;
    documents[4].fileUrl = 'https://wow.olympus.eu/webfile/img/1632/oly_testwow_stage.jpg';
    documents[4].photoSmallURL = '';
    documents[4].updateDate = new Date(2015, 10, 17);
    documents[4].data = {
      tag: '',
      brochure: [],
      size: '',
      plan: false,
    };

    this.documents.next(documents);
  }

  /**
   * Changed documents
   */
  onChangeDocuments(documents: DocumentModel[]): void {

    this.documents.next(documents);
  }
}
