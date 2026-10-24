import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MenuCategory } from '../../../../core/models/menu.model';
import { getCategoryGradient } from '../../../../core/helpers/formatters';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import {
  DonutChartComponent,
  DonutChartSegment,
} from '../../../../shared/components/donut-chart/donut-chart.component';

@Component({
  selector: 'app-category-chart',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    MatProgressBarModule,
    CardComponent,
    BadgeComponent,
    DonutChartComponent,
  ],
  templateUrl: './category-chart.component.html',
  styleUrl: './category-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryChartComponent {
  @Input() distribution: Record<MenuCategory, number> = {
    Appetizers: 0,
    Mains: 0,
    Desserts: 0,
    Beverages: 0,
    Sides: 0,
  };
  @Input() totalItems: number = 0;

  readonly categories: MenuCategory[] = [
    'Appetizers',
    'Mains',
    'Desserts',
    'Beverages',
    'Sides',
  ];

  readonly categoryColors: Record<MenuCategory, string> = {
    Mains: '#6366f1',
    Appetizers: '#10b981',
    Beverages: '#06b6d4',
    Desserts: '#ec4899',
    Sides: '#f59e0b',
  };

  get donutSegments(): DonutChartSegment[] {
    return this.categories.map((cat) => ({
      id: cat.toLowerCase(),
      label: cat,
      value: this.getCategoryCount(cat),
      color: this.categoryColors[cat] || '#818cf8',
    }));
  }

  getCategoryCount(cat: MenuCategory): number {
    return this.distribution?.[cat] || 0;
  }

  getCategoryPercentage(cat: MenuCategory): number {
    if (!this.totalItems || this.totalItems <= 0) return 0;
    const count = this.getCategoryCount(cat);
    return Math.round((count / this.totalItems) * 100);
  }

  getGradient(cat: MenuCategory): string {
    return getCategoryGradient(cat);
  }
}
