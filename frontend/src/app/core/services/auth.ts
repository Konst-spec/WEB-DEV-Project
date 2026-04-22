import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest, AuthResponse, LoginRequest } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly router = inject(Router);
  private apiUrl = 'http://localhost:8000/';

  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';


  readonly isAuthenticated = signal<boolean>(this.hasTokens());

  constructor() {
    this.isAuthenticated.set(this.hasTokens());
  }
  
  register(request: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}register/`, request);
  }

  login(data: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}login/`, data);
  }
  hasTokens(): boolean {
        return !!localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }
    
  saveTokens(tokens: AuthResponse) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.access);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh);
  }
  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
  refreshToken(refresh: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}refresh/`, { refresh });
  }
}
