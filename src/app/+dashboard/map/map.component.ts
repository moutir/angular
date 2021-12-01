import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() data: any[];

  itemLeads = 0;
  itemPortfolio = 0;
  opacity = false;

  setColor(portfolio, leads) {
    let className = null;
    if (leads > 1 && leads >= portfolio) {
      className = 'red';
    } else if (leads < portfolio) {
      className = 'blue';
    } else {
      className = '';
    }
    return className;
  }

  parseData(data) {
    data.map(item => {
      const currentPath = document.querySelectorAll('[data-code="' + item.code + '"]')[0],
        portfolio = item.data.portfolio,
        leads = item.data.leads;
      if (currentPath) {
        currentPath.setAttribute('data-portfolio', portfolio);
        currentPath.setAttribute('data-leads', leads);
        if (portfolio === 0 && leads === 0 || leads === portfolio) {
          return false;
        } else {
          currentPath.classList.add(this.setColor(portfolio, leads));
        }
      }
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.parseData(this.data);
      this.tooltipShowing();
    }
  }

  tooltipShowing() {
    const tooltip = document.getElementById('tooltip'),
      map = document.getElementById('map');
    const self = this;

    [].forEach.call(document.querySelectorAll('#map path'), elem => {
      elem.addEventListener('mousemove', (event) => {
        let eventDoc, doc, body, pageX, pageY,
          bodyRect = document.body.getBoundingClientRect(),
          elemRect = map.getBoundingClientRect(),
          offsetTop = elemRect.top - bodyRect.top,
          offsetLeft = elemRect.left - bodyRect.left,
          tooltipRect = tooltip.getBoundingClientRect();

        event = event || window.event; // IE-ism
        // (This is to support old IE)
        if (event.pageX === null && event.clientX !== null) {
          eventDoc = (event.target && event.target.ownerDocument) || document;
          doc = eventDoc.documentElement;
          body = eventDoc.body;
          event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
          event.pageY = event.clientY +
            (doc && doc.scrollTop || body && body.scrollTop || 0) -
            (doc && doc.clientTop || body && body.clientTop || 0);
        }
        if (this.hasClass(event.target, 'blue') || this.hasClass(event.target, 'red')) {
          const portfolio = event.target.getAttribute('data-portfolio');
          const leads = event.target.getAttribute('data-leads');

          self.itemPortfolio = portfolio;
          self.itemLeads = leads;
          self.opacity = true;

          tooltip.setAttribute('style', `transform: translate(${ event.pageX - offsetLeft - (tooltipRect.width / 2) }px, ${event.pageY - offsetTop - tooltipRect.height - 20}px)`);
        } else {
          self.opacity = false;
        }
      });
      elem.addEventListener('mouseout', () => {
        self.opacity = false;
      });
    });
  }

  private hasClass(el, cls) {

    return el.classList ? el.classList.contains(cls) : new RegExp('(^| )' + cls + '( |$)', 'gi').test(el.cls);
  }
}
