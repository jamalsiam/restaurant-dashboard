import { TestBed } from '@angular/core/testing';
import { StatCardComponent } from './stat-card.component';

describe('StatCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCardComponent],
    }).compileComponents();
  });

  it('renders label, value, and icon correctly', () => {
    const fixture = TestBed.createComponent(StatCardComponent);
    fixture.componentInstance.label = 'Total Items';
    fixture.componentInstance.value = '50,000';
    fixture.componentInstance.icon = 'restaurant_menu';
    fixture.componentInstance.tagText = '100% active';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.stat-label')?.textContent).toContain('Total Items');
    expect(compiled.querySelector('.stat-value')?.textContent).toContain('50,000');
    expect(compiled.querySelector('.stat-tag')?.textContent).toContain('100% active');
  });
});
