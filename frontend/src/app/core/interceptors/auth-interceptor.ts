import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

function addAuthHeader(req: HttpRequest<unknown>, token: string) {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
}

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);


  const isAuthEndpoint = req.url.includes('/login/') || req.url.includes('/register/') || req.url.includes('/refresh/');

  if (!accessToken || isAuthEndpoint) {
    return next(req);
  }

  const authReq = addAuthHeader(req, accessToken);

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        authService.logout();
        return throwError(() => error);
      }

      return authService.refreshToken(refreshToken).pipe(
        switchMap((tokens) => {
          authService.saveTokens(tokens);
          const retryReq = addAuthHeader(req, tokens.access);
          return next(retryReq);
        }),
        catchError((refreshError) => {
          authService.logout();
          return throwError(() => refreshError);
        })
      );
    })
  );
};