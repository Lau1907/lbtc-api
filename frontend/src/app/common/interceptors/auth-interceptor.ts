import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const cloned = token ? req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  }) : req;

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expirado, intentar refresh
        const refreshToken = auth.getRefreshToken();
        if (refreshToken) {
          return auth.refresh(refreshToken).pipe(
            switchMap((res: any) => {
              auth.saveTokens(res.access_token, res.refresh_token);
              const retried = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${res.access_token}`)
              });
              return next(retried);
            }),
            catchError(() => {
              auth.logout();
              window.location.href = '/';
              return throwError(() => error);
            })
          );
        } else {
          auth.logout();
          window.location.href = '/';
        }
      }
      return throwError(() => error);
    })
  );
};