import { TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { provideRouter } from '@angular/router';
import { DashboardStateService } from '../../features/dashboard/dashboard-state.service';
import { ThemeService } from '../../core/services/theme.service';
import { signal } from '@angular/core';

describe('NavbarComponent', () => {
  let themeService: ThemeService;

  beforeEach(async () => {
    const mockDashboardState = {
      stats: signal({
        totalItems: 50000,
        availableItems: 42000,
        unavailableItems: 8000,
        averagePrice: 24.5,
        categoryDistribution: {} as any,
        restaurants: [],
        lastCalculatedAt: new Date().toISOString(),
      }),
      loadStats: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        { provide: DashboardStateService, useValue: mockDashboardState },
      ],
    }).compileComponents();

    themeService = TestBed.inject(ThemeService);
  });

  it('renders brand title and navigation links', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-title')?.textContent).toContain('RestoData Enterprise');
    expect(compiled.querySelectorAll('.nav-link').length).toBe(2);
  });

  it('renders theme toggle button and toggles theme on click', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    themeService.setTheme('dark');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const toggleBtn = compiled.querySelector('.theme-toggle-btn') as HTMLButtonElement;
    expect(toggleBtn).toBeTruthy();
    expect(toggleBtn.getAttribute('aria-label')).toBe('Switch to Light Mode');

    // Click toggle to switch to Light Mode
    toggleBtn.click();
    fixture.detectChanges();

    expect(themeService.theme()).toBe('light');
    expect(toggleBtn.getAttribute('aria-label')).toBe('Switch to Dark Mode');
  });

  it('toggles mobile menu drawer on mobile menu button click', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.mobileMenuOpen()).toBe(false);

    const mobileBtn = fixture.nativeElement.querySelector('.mobile-menu-btn') as HTMLButtonElement;
    expect(mobileBtn).toBeTruthy();

    mobileBtn.click();
    fixture.detectChanges();

    expect(component.mobileMenuOpen()).toBe(true);
    expect(fixture.nativeElement.querySelector('.mobile-drawer')).toBeTruthy();

    // Closing the menu
    component.closeMobileMenu();
    fixture.detectChanges();

    expect(component.mobileMenuOpen()).toBe(false);
    expect(fixture.nativeElement.querySelector('.mobile-drawer')).toBeFalsy();
  });

  it('updates isScrolled signal on scroll', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    expect(component.isScrolled()).toBe(false);

    // Simulate scroll down
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(component.isScrolled()).toBe(true);

    // Simulate scroll back to top
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(component.isScrolled()).toBe(false);
  });
});
