import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  template: '<input [placeholder]="placeholder" />',
})
export class InputComponent {
  @Input() placeholder = '';
}
