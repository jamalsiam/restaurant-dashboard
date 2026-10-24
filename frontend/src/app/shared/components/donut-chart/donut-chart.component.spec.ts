import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonutChartComponent, DonutChartSegment } from './donut-chart.component';

describe('DonutChartComponent (ECharts)', () => {
  let component: DonutChartComponent;
  let fixture: ComponentFixture<DonutChartComponent>;

  const mockSegments: DonutChartSegment[] = [
    { label: 'Mains', value: 350, color: '#6366f1' },
    { label: 'Appetizers', value: 250, color: '#10b981' },
    { label: 'Desserts', value: 150, color: '#ec4899' },
    { label: 'Beverages', value: 150, color: '#06b6d4' },
    { label: 'Sides', value: 100, color: '#f59e0b' },
  ];

  beforeAll(() => {
    // Polyfill ResizeObserver for test environment if needed
    if (typeof (globalThis as any).ResizeObserver === 'undefined') {
      (globalThis as any).ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      };
    }
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonutChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DonutChartComponent);
    component = fixture.componentInstance;
  });

  it('should create the ECharts donut chart component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total correctly from segments', () => {
    fixture.componentRef.setInput('segments', mockSegments);
    fixture.detectChanges();

    expect(component.calculatedTotal()).toBe(1000);
  });

  it('should display total formatted value in the center overlay by default', () => {
    fixture.componentRef.setInput('segments', mockSegments);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const centerVal = compiled.querySelector('.center-value');
    expect(centerVal?.textContent?.trim()).toBe('1,000');
  });

  it('should update center overlay when a segment is hovered', () => {
    fixture.componentRef.setInput('segments', mockSegments);
    fixture.detectChanges();

    component.hoveredSegment.set(mockSegments[0]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const centerVal = compiled.querySelector('.center-value');
    const centerLabel = compiled.querySelector('.center-label');
    const centerPct = compiled.querySelector('.center-pct');

    expect(centerVal?.textContent?.trim()).toBe('350');
    expect(centerLabel?.textContent?.trim()).toBe('Mains');
    expect(centerPct?.textContent?.trim()).toBe('35%');
  });

  it('should reset center overlay on hover clear', () => {
    fixture.componentRef.setInput('segments', mockSegments);
    fixture.detectChanges();

    component.hoveredSegment.set(mockSegments[0]);
    fixture.detectChanges();

    component.hoveredSegment.set(null);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const centerVal = compiled.querySelector('.center-value');
    expect(centerVal?.textContent?.trim()).toBe('1,000');
  });
});
