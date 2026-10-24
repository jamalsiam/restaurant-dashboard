import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  let url = req.url;

  // In development, if relative /api URL is used, point to backend
  if (url.startsWith('/api')) {
    url = `http://localhost:3000${url}`;
  }

  const modifiedReq = req.clone({
    url,
    setHeaders: {
      'Accept': 'application/json',
      'X-Client-Request-Id': Math.random().toString(36).substring(2, 10),
    },
  });

  return next(modifiedReq);
};
