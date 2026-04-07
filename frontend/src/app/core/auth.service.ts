import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

interface AuthResponse {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl + '/auth';
  private tokenKey = 'findash_token';

  login(username: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(tap((response) => this.setSession(response.token)));
  }

  register(username: string, password: string, repeatPassword: string) {
    return this.http.post(`${this.apiUrl}/register`, {
      username,
      password,
      repeatPassword,
    });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/auth']);
  }

  private setSession(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: { exp: number } = jwtDecode(token);
      const isExpired = Date.now() >= decoded.exp * 1000;
      return !isExpired;
    } catch (error) {
      return false;
    }
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: { sub: string } = jwtDecode(token);
      return decoded.sub;
    } catch (error) {
      return null;
    }
  }
}
