import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CategoryChartComponent } from './components/category-chart/category-chart.component';
import { DashboardStateService } from './dashboard-state.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { calculatePercentage, formatCurrency } from '../../core/helpers/formatters';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CategoryChartComponent,
    StatCardComponent,
    ButtonComponent,
    CardComponent,
    BadgeComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  readonly state = inject(DashboardStateService);

  ngOnInit(): void {
    if (!this.state.stats()) {
      this.state.loadStats();
    }
  }

  getAvailabilityRate(): string {
    const s = this.state.stats();
    if (!s || s.totalItems === 0) return '0.0';
    return calculatePercentage(s.availableItems, s.totalItems);
  }

  getUnavailableRate(): string {
    const s = this.state.stats();
    if (!s || s.totalItems === 0) return '0.0';
    return calculatePercentage(s.unavailableItems, s.totalItems);
  }

  formatPrice(val?: number): string {
    return formatCurrency(val ?? 0);
  }
}
