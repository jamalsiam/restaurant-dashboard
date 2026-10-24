import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: '<div class="card"><ng-content></ng-content></div>',
})
export class CardComponent {
  @Input() title = '';
}
