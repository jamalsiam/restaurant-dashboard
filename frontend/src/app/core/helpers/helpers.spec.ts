import { formatCurrency, calculatePercentage, getCategoryGradient } from './formatters';
import { buildQueryParams } from './query.helper';
import { FormControl, FormGroup } from '@angular/forms';
import { priceRangeValidator, notWhitespaceValidator } from './validation.helper';

describe('Core Helpers', () => {
  describe('formatters', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(12.5)).toBe('$12.50');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(NaN)).toBe('$0.00');
    });

    it('calculates percentage accurately', () => {
      expect(calculatePercentage(25, 100)).toBe('25.0');
      expect(calculatePercentage(1, 3)).toBe('33.3');
      expect(calculatePercentage(10, 0)).toBe('0.0');
    });

    it('returns category gradients', () => {
      expect(getCategoryGradient('Mains')).toContain('linear-gradient');
      expect(getCategoryGradient('Desserts')).toContain('linear-gradient');
      expect(getCategoryGradient('Unknown')).toContain('linear-gradient');
    });
  });

  describe('query.helper', () => {
    it('builds query parameters excluding empty values', () => {
      const params = buildQueryParams({
        page: 2,
        pageSize: 50,
        search: 'burger',
        category: 'Mains',
        availability: 'all',
      });

      expect(params.get('page')).toBe('2');
      expect(params.get('pageSize')).toBe('50');
      expect(params.get('search')).toBe('burger');
      expect(params.get('category')).toBe('Mains');
      expect(params.has('availability')).toBe(false); // 'all' is skipped
    });
  });

  describe('validation.helper', () => {
    it('validates price range correctly', () => {
      const form = new FormGroup(
        {
          minPrice: new FormControl(50),
          maxPrice: new FormControl(10),
        },
        { validators: priceRangeValidator() }
      );

      expect(form.errors).toEqual({ invalidPriceRange: true });

      form.patchValue({ maxPrice: 100 });
      expect(form.errors).toBeNull();
    });

    it('validates whitespace only strings', () => {
      const validator = notWhitespaceValidator();
      expect(validator(new FormControl('   '))).toEqual({ whitespaceOnly: true });
      expect(validator(new FormControl('Valid text'))).toBeNull();
    });
  });
});
