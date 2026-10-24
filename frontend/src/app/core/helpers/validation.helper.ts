import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates that minPrice is less than or equal to maxPrice.
 */
export function priceRangeValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const minControl = group.get('minPrice');
    const maxControl = group.get('maxPrice');

    if (!minControl || !maxControl) return null;

    const min = minControl.value;
    const max = maxControl.value;

    if (
      min !== null &&
      min !== undefined &&
      min !== '' &&
      max !== null &&
      max !== undefined &&
      max !== '' &&
      Number(min) > Number(max)
    ) {
      return { invalidPriceRange: true };
    }
    return null;
  };
}

/**
 * Validates that string input is not just whitespace.
 */
export function notWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && typeof control.value === 'string' && control.value.trim().length === 0) {
      return { whitespaceOnly: true };
    }
    return null;
  };
}
