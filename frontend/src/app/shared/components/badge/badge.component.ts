import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: '<span class="badge"><ng-content></ng-content></span>',
})
export class BadgeComponent {
  @Input() variant = 'info';
}
