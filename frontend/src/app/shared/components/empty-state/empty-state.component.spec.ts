import { TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    }).compileComponents();
  });

  it('renders title, description and handles action click', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentInstance.title = 'No items found';
    fixture.componentInstance.description = 'Try searching with another keyword.';
    fixture.componentInstance.actionText = 'Reset Filters';

    let clicked = false;
    fixture.componentInstance.actionClicked.subscribe(() => {
      clicked = true;
    });

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.state-title')?.textContent).toContain('No items found');
    expect(compiled.querySelector('.state-desc')?.textContent).toContain('Try searching');

    const button = compiled.querySelector('.state-action-btn') as HTMLButtonElement;
    expect(button).toBeTruthy();
    button.click();
    expect(clicked).toBe(true);
  });
});
