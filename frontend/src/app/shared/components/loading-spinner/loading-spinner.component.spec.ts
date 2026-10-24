import { TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
    }).compileComponents();
  });

  it('renders loading spinner and custom message', () => {
    const fixture = TestBed.createComponent(LoadingSpinnerComponent);
    fixture.componentInstance.message = 'Fetching 50,000 records...';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.loading-text')?.textContent).toContain('Fetching 50,000 records...');
  });
});
