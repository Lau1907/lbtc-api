import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const cloned = token ? req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  }) : req;

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      // SOLO intentar refresh o logout si el error es 401 Y NO ES la ruta de registro
      if (error.status === 401 && !req.url.includes('/auth/register')) {
        const refreshToken = auth.getRefreshToken();
        if (refreshToken) {
          // ... (tu lógica de refresh igual)
        } else {
          auth.logout();
          window.location.href = '/';
        }
      }
      // Si es un 409 o un 401 de registro, el error pasa de largo hacia el componente
      return throwError(() => error);
    })
  );
};