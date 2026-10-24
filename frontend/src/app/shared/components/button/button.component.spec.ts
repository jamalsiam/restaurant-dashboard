import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { describe, expect, it, vi } from 'vitest';

describe('ButtonComponent', () => {
  it('renders primary button by default and emits btnClick on click', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.classList.contains('primary-variant')).toBe(true);

    const spy = vi.fn();
    fixture.componentInstance.btnClick.subscribe(spy);

    btn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('renders stroked and warn variants properly', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentRef.setInput('variant', 'stroked');
    fixture.detectChanges();

    let btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.classList.contains('stroked-variant')).toBe(true);

    fixture.componentRef.setInput('variant', 'warn');
    fixture.detectChanges();
    btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.classList.contains('warn-variant')).toBe(true);
  });
});
