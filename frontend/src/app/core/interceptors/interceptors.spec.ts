import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { apiInterceptor } from './api.interceptor';
import { errorInterceptor } from './error.interceptor';
import { NotificationService } from '../services/notification.service';

describe('HTTP Interceptors', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiInterceptor, errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('prefixes relative /api URLs and adds client headers', () => {
    http.get('/api/items').subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/items');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Accept')).toBe(true);
    expect(req.request.headers.has('X-Client-Request-Id')).toBe(true);
    req.flush([]);
  });

  it('handles error response and triggers notification', () => {
    let capturedError: Error | null = null;
    http.get('/api/error-test').subscribe({
      next: () => {
        expect(false).toBe(true);
      },
      error: (err) => {
        capturedError = err;
      },
    });

    const req = httpMock.expectOne('http://localhost:3000/api/error-test');
    req.flush({ message: 'Resource not found' }, { status: 404, statusText: 'Not Found' });

    expect(capturedError).not.toBeNull();
    expect(notificationService.notifications().length).toBe(1);
    expect(notificationService.notifications()[0].type).toBe('error');
    expect(notificationService.notifications()[0].message).toBe('Resource not found');
  });
});
