import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  @Input({ required: true }) title: string = '';
  @Input() description: string = '';
  @Input() icon: string = 'sentiment_dissatisfied';
  @Input() actionText: string = '';
  @Input() isError: boolean = false;

  @Output() actionClicked = new EventEmitter<void>();

  onAction(): void {
    this.actionClicked.emit();
  }
}
