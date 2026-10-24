import { TestBed } from '@angular/core/testing';
import { SingleSelectComponent } from './single-select.component';
import { describe, expect, it } from 'vitest';

describe('SingleSelectComponent', () => {
  it('renders select element with label', () => {
    const fixture = TestBed.createComponent(SingleSelectComponent);
    fixture.componentRef.setInput('label', 'Category');
    fixture.componentRef.setInput('options', [
      { value: 'Mains', label: 'Mains' },
      { value: 'Desserts', label: 'Desserts' },
    ]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-select')).toBeTruthy();
    expect(compiled.querySelector('mat-label')?.textContent).toContain('Category');
  });
});
