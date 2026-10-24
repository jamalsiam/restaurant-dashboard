import { TestBed } from '@angular/core/testing';
import { SearchBoxComponent } from './search-box.component';
import { describe, expect, it, vi } from 'vitest';

describe('SearchBoxComponent', () => {
  it('renders input and emits valueChange on typing', () => {
    const fixture = TestBed.createComponent(SearchBoxComponent);
    fixture.componentRef.setInput('label', 'Search Dishes');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input).toBeTruthy();

    const spy = vi.fn();
    fixture.componentInstance.valueChange.subscribe(spy);

    input.value = 'Pizza';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('Pizza');
  });

  it('renders clear button when value is present and clears on click', () => {
    const fixture = TestBed.createComponent(SearchBoxComponent);
    fixture.componentRef.setInput('value', 'Burger');
    fixture.detectChanges();

    const clearBtn = fixture.nativeElement.querySelector('.search-clear-btn') as HTMLButtonElement;
    expect(clearBtn).toBeTruthy();

    const clearSpy = vi.fn();
    fixture.componentInstance.cleared.subscribe(clearSpy);

    clearBtn.click();
    expect(clearSpy).toHaveBeenCalled();
  });
});
