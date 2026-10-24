import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected network error occurred';

      if (error.status === 0) {
        errorMessage = 'Unable to connect to the backend server. Please verify backend is running on port 3000.';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Invalid request parameters.';
      } else if (error.status === 404) {
        errorMessage = error.error?.message || 'Requested resource was not found.';
      } else if (error.status >= 500) {
        errorMessage = 'Backend server encountered an error. Please try again later.';
      } else if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage = error.error.message;
      }

      console.error(`[HTTP Error ${error.status}] [${req.method} ${req.url}]:`, error);
      
      // Notify user via toast unless it's a silent polling request
      notificationService.error(errorMessage);

      return throwError(() => new Error(errorMessage));
    })
  );
};
