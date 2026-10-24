import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: '<button><ng-content></ng-content></button>',
})
export class ButtonComponent {
  @Input() variant = 'primary';
}
