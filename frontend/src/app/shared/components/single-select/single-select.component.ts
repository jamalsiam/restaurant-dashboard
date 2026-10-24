import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

export interface SelectOption<T = any> {
  value: T;
  label: string;
}

@Component({
  selector: 'app-single-select',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './single-select.component.html',
  styleUrl: './single-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleSelectComponent {
  readonly label = input<string>('Select');
  readonly value = input<any>('');
  readonly options = input<SelectOption[]>([]);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly valueChange = output<any>();
}
