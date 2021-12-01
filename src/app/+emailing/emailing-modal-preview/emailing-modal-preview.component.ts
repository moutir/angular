import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as Handlebars from 'handlebars/dist/cjs/handlebars';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { EmailingPreviewInterface } from '../../shared/interface/emailing-preview.interface';
import { KeyValueType } from '../../shared/type/key-value.type';
import { EmailingPreviewDataInterface } from '../../shared/interface/emailing-preview-data.interface';

@Component({
  selector: 'app-emailing-modal-preview',
  templateUrl: './emailing-modal-preview.component.html',
  styleUrls: ['./emailing-modal-preview.component.scss'],
})
export class EmailingModalPreviewComponent
  extends ModalComponentAbstract<null> implements OnChanges {

  /**
   * Email preview
   */
  @Input() preview: EmailingPreviewInterface;

  /**
   * Preview HTML per language
   */
  previews: Array<{ language: string, html: SafeHtml }> = [];

  /**
   * Constructor
   */
  constructor(
    private domSanitizer: DomSanitizer,
  ) {

    super();

    // TODO[later] Remove this garbage when dropping support for Handlebars
    // tslint:disable
    Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {

      if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

        var operator = options.hash.operator || "==";

        var operators =
          {
            '==':       function(l,r) { return l == r; },
            '===':      function(l,r) { return l === r; },
            '!=':       function(l,r) { return l != r; },
            '<':        function(l,r) { return l < r; },
            '>':        function(l,r) { return l > r; },
            '<=':       function(l,r) { return l <= r; },
            '>=':       function(l,r) { return l >= r; },
            'typeof':   function(l,r) { return typeof l == r; }
          }

        if (!operators[operator])
          throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);

        var result = operators[operator](lvalue, rvalue);

        if (result)
          return options.fn(this);
        else
          return options.inverse(this);
      });

      Handlebars.registerHelper('get_obj_value', function(obj, key)
      {
        if (arguments.length < 3)
          throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

        return obj[key] !== undefined ? obj[key] : '';
      });

      Handlebars.registerHelper("counter", function (index) {
        return index + 1;
      });

      Handlebars.registerHelper("property_details_link", function (p) {

        return [
          '/property/index/',
          p.archived == "1" ? "archive" : "active",
          '/',
          p.server_id,
          '?property_id=',
          p.is_rental ? "rental" : "sell",
        ].join('');
      });

      Handlebars.registerHelper('toUpperCase', function(value) {
        return new Handlebars.SafeString(value.toUpperCase());
      });

      Handlebars.registerHelper('arrayNotEmpty', function(array, options) {
        if (!array || array.length === 0) {
          return options.fn(this);
        }
        return options.inverse(this);
      });

      Handlebars.registerHelper('ifIn', function(elem, options) {
        var list = JSON.parse(options.hash.array);
        if(list.indexOf(parseInt(elem)) >= 0) {
          return options.fn(this);
        }
        return options.inverse(this);
      });
      Handlebars.registerHelper('ifObject', function(item, options) {
        if(typeof item === "object") {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });
      Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

        switch (operator) {
          case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
          case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
          case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
          case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
          case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
          case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
          case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
          case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
          case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
          case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
          default:
            return options.inverse(this);
        }
      });
      // tslint:enable
  }

  /**
   * @inheritDoc
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    if (changes.preview) {

      this.onNextPreviews(this.preview.data);
    }
  }

  /**
   * Next previews
   */
  private onNextPreviews(previews: KeyValueType<string, EmailingPreviewDataInterface>): void {

    this.previews = [];

    Object
      .keys(previews)
      .forEach(language => {

        const template = previews[language].template;
        const compiled = Handlebars.compile(template);
        const html = compiled(previews[language].data);

        this.previews.push({
          language: language,
          html: this.domSanitizer.bypassSecurityTrustHtml(html),
        });
      });
  }
}
