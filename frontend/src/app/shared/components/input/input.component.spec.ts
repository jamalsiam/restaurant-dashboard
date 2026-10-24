import { TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { describe, expect, it, vi } from 'vitest';

describe('InputComponent', () => {
  it('renders input with prefix and emits on change', () => {
    const fixture = TestBed.createComponent(InputComponent);
    fixture.componentRef.setInput('label', 'Price');
    fixture.componentRef.setInput('prefix', '$');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.input-prefix')?.textContent).toBe('$');

    const input = compiled.querySelector('input') as HTMLInputElement;
    expect(input).toBeTruthy();

    const spy = vi.fn();
    fixture.componentInstance.valueChange.subscribe(spy);

    input.value = '25';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('25');
  });
});
