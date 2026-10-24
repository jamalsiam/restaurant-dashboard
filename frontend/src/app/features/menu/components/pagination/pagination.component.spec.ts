import { TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { MenuStateService } from '../../menu-state.service';
import { signal } from '@angular/core';

describe('PaginationComponent', () => {
  beforeEach(async () => {
    const mockMenuState = {
      page: signal(2),
      pageSize: signal(50),
      total: signal(1250),
      totalPages: signal(25),
      loading: signal(false),
      setPage: vi.fn(),
      setPageSize: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
      providers: [{ provide: MenuStateService, useValue: mockMenuState }],
    }).compileComponents();
  });

  it('renders pagination indicator and computes range', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component.getRangeStart()).toBe(51);
    expect(component.getRangeEnd()).toBe(100);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.page-indicator')?.textContent).toContain('Page 2 of 25');
  });
});
