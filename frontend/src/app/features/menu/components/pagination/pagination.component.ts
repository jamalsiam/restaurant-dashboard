import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MenuStateService } from '../../menu-state.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  readonly state = inject(MenuStateService);

  getRangeStart(): number {
    if (this.state.total() === 0) return 0;
    return (this.state.page() - 1) * this.state.pageSize() + 1;
  }

  getRangeEnd(): number {
    const end = this.state.page() * this.state.pageSize();
    return Math.min(end, this.state.total());
  }
}
