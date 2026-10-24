import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category-chart',
  standalone: true,
  template: '<div>Distribution Chart Placeholder</div>',
})
export class CategoryChartComponent {
  @Input() distribution: any;
}
