import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  effect,
  HostListener,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MenuStateService } from '../../menu-state.service';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-edit-item-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BadgeComponent,
    ButtonComponent,
  ],
  templateUrl: './edit-item-modal.component.html',
  styleUrl: './edit-item-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditItemModalComponent implements OnInit {
  readonly state = inject(MenuStateService);

  readonly form = new FormGroup({
    price: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    isAvailable: new FormControl<boolean>(true, { nonNullable: true }),
  });

  get priceControl(): FormControl<number> {
    return this.form.controls.price;
  }

  constructor() {
    effect(() => {
      const item = this.state.selectedItem();
      if (item) {
        this.form.setValue({
          price: item.price,
          isAvailable: item.isAvailable,
        });
        this.form.markAsPristine();
      }
    });
  }

  ngOnInit(): void {}

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.state.isEditModalOpen() && !this.state.isUpdating()) {
      this.state.closeEditModal();
    }
  }

  onBackdropClick(_event: MouseEvent): void {
    if (!this.state.isUpdating()) {
      this.state.closeEditModal();
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.state.isUpdating()) return;

    const currentItem = this.state.selectedItem();
    if (!currentItem) return;

    const values = this.form.getRawValue();
    await this.state.updateItem(currentItem.id, {
      price: values.price,
      isAvailable: values.isAvailable,
    });
  }
}
