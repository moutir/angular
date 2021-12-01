import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CostPerLeadInterface } from '../interface/cost-per-lead.interface';
import { FormatNumberPipe } from '../../number/shared/format-number.pipe';

@Pipe({
  name: 'costPerLead',
})
export class CostPerLeadPipe implements PipeTransform {

  /**
   * Constructor
   */
  constructor(
    private formatNumberPipe: FormatNumberPipe,
    private translateService: TranslateService,
  ) {

  }

  /**
   * Transforms a CostPerLeadInterface into a string
   */
  transform(costPerLead: CostPerLeadInterface): string {

    if (costPerLead.leadCount < 1) {

      return this.translateService.instant('label_cost_per_lead_no_lead', {
        totalCost: this.formatNumberPipe.transform(costPerLead.totalCost),
      });
    }

    return this.translateService.instant(
      costPerLead.leadCount > 1 ? 'label_cost_per_lead_plural' : 'label_cost_per_lead_singular',
      {
        leadCount: costPerLead.leadCount,
        averageCost: this.formatNumberPipe.transform(costPerLead.averageCost),
      },
    );
  }
}
