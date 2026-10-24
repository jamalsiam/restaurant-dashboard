import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MenuStateService } from '../../menu-state.service';
import { MenuItem } from '../../../../core/models/menu.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-menu-table',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    DatePipe,
    MatTableModule,
    MatSortModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    BadgeComponent,
    ButtonComponent,
  ],
  templateUrl: './menu-table.component.html',
  styleUrl: './menu-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuTableComponent {
  readonly state = inject(MenuStateService);

  readonly displayedColumns: string[] = [
    'id',
    'name',
    'category',
    'location',
    'price',
    'status',
    'updatedAt',
    'actions',
  ];

  getSortAria(column: string): 'ascending' | 'descending' | 'none' {
    if (this.state.sortBy() !== column) return 'none';
    return this.state.sortOrder() === 'ASC' ? 'ascending' : 'descending';
  }

  trackByItemId(_index: number, item: MenuItem): string {
    return item.id;
  }
}
