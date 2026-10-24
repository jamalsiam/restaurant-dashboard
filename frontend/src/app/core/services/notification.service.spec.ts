import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('adds and clears notifications', () => {
    service.success('Item saved');
    service.error('Failed to update');

    expect(service.notifications().length).toBe(2);
    expect(service.notifications()[0].message).toBe('Item saved');
    expect(service.notifications()[0].type).toBe('success');
    expect(service.notifications()[1].type).toBe('error');

    service.dismiss(service.notifications()[0].id);
    expect(service.notifications().length).toBe(1);

    service.clear();
    expect(service.notifications().length).toBe(0);
  });
});
