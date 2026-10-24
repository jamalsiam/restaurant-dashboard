import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  @Input({ required: true }) label: string = '';
  @Input({ required: true }) value: string | number | null = '';
  @Input({ required: true }) icon: string = '';
  @Input() iconClass: string = '';
  @Input() tagText: string = '';
  @Input() tagClass: string = 'tag-neutral';
  @Input() subtitle: string = '';
  @Input() valueClass: string = '';
}
