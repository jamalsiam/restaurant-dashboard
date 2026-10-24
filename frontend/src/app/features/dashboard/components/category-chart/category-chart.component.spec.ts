import { TestBed } from '@angular/core/testing';
import { CategoryChartComponent } from './category-chart.component';

describe('CategoryChartComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryChartComponent],
    }).compileComponents();
  });

  it('renders category breakdown bars properly', () => {
    const fixture = TestBed.createComponent(CategoryChartComponent);
    fixture.componentInstance.distribution = {
      Appetizers: 5000,
      Mains: 20000,
      Desserts: 10000,
      Beverages: 10000,
      Sides: 5000,
    };
    fixture.componentInstance.totalItems = 50000;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.bar-row').length).toBe(5);
    expect(fixture.componentInstance.getCategoryPercentage('Mains')).toBe(40);
  });
});
