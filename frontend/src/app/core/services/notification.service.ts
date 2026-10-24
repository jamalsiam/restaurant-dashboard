import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: number;
  durationMs?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly _notifications = signal<AppNotification[]>([]);
  readonly notifications = this._notifications.asReadonly();

  show(message: string, type: NotificationType = 'info', durationMs: number = 4000): void {
    const id = Math.random().toString(36).substring(2, 9);
    const notification: AppNotification = {
      id,
      type,
      message,
      timestamp: Date.now(),
      durationMs,
    };

    this._notifications.update((prev) => [...prev, notification]);

    if (durationMs > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, durationMs);
    }
  }

  success(message: string, durationMs?: number): void {
    this.show(message, 'success', durationMs);
  }

  error(message: string, durationMs: number = 6000): void {
    this.show(message, 'error', durationMs);
  }

  warning(message: string, durationMs?: number): void {
    this.show(message, 'warning', durationMs);
  }

  info(message: string, durationMs?: number): void {
    this.show(message, 'info', durationMs);
  }

  dismiss(id: string): void {
    this._notifications.update((prev) => prev.filter((n) => n.id !== id));
  }

  clear(): void {
    this._notifications.set([]);
  }
}
