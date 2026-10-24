import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-category-chart',
  standalone: true,
  imports: [CommonModule, DecimalPipe, CardComponent, BadgeComponent],
  template: '<app-card title="Category Distribution"><div class="bars"></div></app-card>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryChartComponent {
  @Input() distribution: any;
  @Input() totalItems: number = 0;
}
