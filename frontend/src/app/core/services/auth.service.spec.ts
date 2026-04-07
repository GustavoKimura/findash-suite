import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const createFakeToken = (exp: number, sub: string) => {
  const payload = btoa(JSON.stringify({ exp, sub }));
  return `header.${payload}.signature`;
};

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerMock: any;

  beforeEach(() => {
    routerMock = { navigate: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerMock },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login and set session', () => {
    service.login('user', 'pass').subscribe();
    const req = httpMock.expectOne(environment.apiUrl + '/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'fake-token', username: 'user' });

    expect(service.getToken()).toBe('fake-token');
  });

  it('should register successfully', () => {
    service.register('user', 'pass', 'pass').subscribe();
    const req = httpMock.expectOne(environment.apiUrl + '/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should logout and clear session', () => {
    localStorage.setItem('findash_token', 'test');
    service.logout();
    expect(service.getToken()).toBeNull();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth']);
  });

  it('should return false for isLoggedIn if no token', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should return true if token is valid and not expired', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    localStorage.setItem('findash_token', createFakeToken(futureExp, 'user'));
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should return false if token is expired', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 3600;
    localStorage.setItem('findash_token', createFakeToken(pastExp, 'user'));
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should return false if token is invalid', () => {
    localStorage.setItem('findash_token', 'invalid-token-format');
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should return null for getUsername if no token', () => {
    expect(service.getUsername()).toBeNull();
  });

  it('should return username if token is valid', () => {
    localStorage.setItem(
      'findash_token',
      createFakeToken(9999999999, 'testuser'),
    );
    expect(service.getUsername()).toBe('testuser');
  });

  it('should return null for getUsername if token is invalid', () => {
    localStorage.setItem('findash_token', 'invalid-token-format');
    expect(service.getUsername()).toBeNull();
  });
});
