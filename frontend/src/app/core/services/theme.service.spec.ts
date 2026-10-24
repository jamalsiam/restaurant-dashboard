import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('initializes with default or stored theme', () => {
    expect(service.theme()).toBeTruthy();
    expect(['light', 'dark']).toContain(service.theme());
  });

  it('toggles theme between light and dark', () => {
    service.setTheme('dark');
    expect(service.isDark()).toBe(true);

    service.toggleTheme();
    expect(service.theme()).toBe('light');
    expect(service.isDark()).toBe(false);

    service.toggleTheme();
    expect(service.theme()).toBe('dark');
    expect(service.isDark()).toBe(true);
  });

  it('updates document attributes on theme switch', () => {
    service.setTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    service.setTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
