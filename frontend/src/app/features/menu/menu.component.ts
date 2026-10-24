import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuStateService } from './menu-state.service';
import { EditItemModalComponent } from './components/edit-item-modal/edit-item-modal.component';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { MenuTableComponent } from './components/menu-table/menu-table.component';
import { PaginationComponent } from './components/pagination/pagination.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    EditItemModalComponent,
    FilterBarComponent,
    MenuTableComponent,
    PaginationComponent,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit, OnDestroy {
  readonly state = inject(MenuStateService);

  ngOnInit(): void {
    if (this.state.items().length === 0) {
      this.state.dispatchQuery();
    }
  }

  ngOnDestroy(): void {
    this.state.destroy();
  }
}
