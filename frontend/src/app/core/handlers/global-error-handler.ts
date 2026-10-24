import { ErrorHandler, Injectable, inject, NgZone } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly zone = inject(NgZone);
  private readonly notificationService = inject(NotificationService);

  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);

    console.error('[Application Global Error Caught]:', error);

    // Run inside NgZone to ensure UI signals/notifications update correctly
    this.zone.run(() => {
      // Avoid spamming duplicate alerts for common user cancellations
      if (message.includes('ResizeObserver') || message.includes('AbortError')) {
        return;
      }
      this.notificationService.error(`Client Error: ${message.slice(0, 150)}`);
    });
  }
}
