import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant =
  | 'category'
  | 'status-success'
  | 'status-danger'
  | 'neutral'
  | 'primary'
  | 'info';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('neutral');
  readonly text = input<string>('');
  readonly category = input<string | undefined>(undefined);
  readonly isAvailable = input<boolean | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly showDot = computed(() => {
    return this.isAvailable() !== undefined || this.variant().startsWith('status-');
  });

  readonly displayText = computed(() => {
    if (this.text()) return this.text();
    const isAvail = this.isAvailable();
    if (isAvail !== undefined) {
      return isAvail ? 'In Stock' : 'Out of Stock';
    }
    const cat = this.category();
    if (cat) return cat;
    return '';
  });

  readonly badgeClass = computed(() => {
    const isAvail = this.isAvailable();
    if (isAvail !== undefined) {
      return isAvail ? 'badge-status-in-stock' : 'badge-status-out-of-stock';
    }

    const cat = this.category();
    if (cat) {
      return `badge-category cat-${cat.toLowerCase()}`;
    }

    return `badge-${this.variant()}`;
  });
}
