import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  login(data: { username: string; password: string }) {
    return this.http.post<{ access_token: string; refresh_token: string }>(
      `${this.apiUrl}/login`, data
    );
  }

  register(data: { name: string; lastname: string; username: string; password: string }) {
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
}