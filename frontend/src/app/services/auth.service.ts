import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
refresh(refreshToken: string) {
  return this.http.post<{ access_token: string; refresh_token: string }>(
    `${this.apiUrl}/refresh`,
    {},
    { headers: { Authorization: `Bearer ${refreshToken}` } }
  );
}

  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  login(data: { username: string; password: string }) {
    return this.http.post<{ access_token: string; refresh_token: string }>(
      `${this.apiUrl}/login`, data
    );
  }

register(data: { name: string; lastname: string; username: string; password: string; role: string }) {
  return this.http.post<{ access_token: string; refresh_token: string }>(
    `${this.apiUrl}/register`, data
  );
}

  saveTokens(access_token: string, refresh_token: string) {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  isLogged() {
    return !!this.getToken();
  }

// auth.service.ts
getCurrentUser(): any {
  const token = this.getToken();
  if (!token) return null;
  
  try {
    // Usamos una forma más segura de decodificar el payload del JWT
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload;
  } catch (e) {
    console.error("Error decodificando token", e);
    return null;
  }
}

isAdmin(): boolean {
  const user = this.getCurrentUser();
  // Verifica que el backend esté mandando 'admin' exactamente en el payload
  return user && user.role === 'admin';
}
}