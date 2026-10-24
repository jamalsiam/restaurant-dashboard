import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: '<div class="stat">{{ label }}: {{ value }}</div>',
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value = '';
}
