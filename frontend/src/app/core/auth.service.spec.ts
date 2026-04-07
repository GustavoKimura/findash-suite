import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;
  const apiUrl = environment.apiUrl + '/auth';
  const tokenKey = 'findash_token';

  const mockRouter = {
    navigate: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: Router, useValue: mockRouter },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    localStorage.removeItem(tokenKey);
    vi.clearAllMocks();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token', () => {
    const mockResponse = { token: 'test-token', username: 'test' };
    service.login('test', 'password').subscribe();

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(localStorage.getItem(tokenKey)).toBe('test-token');
  });

  it('should register a new user', () => {
    service.register('newuser', 'password', 'password').subscribe();
    const req = httpMock.expectOne(`${apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should logout, remove token and navigate to /auth', () => {
    localStorage.setItem(tokenKey, 'test-token');
    service.logout();
    expect(localStorage.getItem(tokenKey)).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  });

  it('isLoggedIn should return true for valid token', () => {
    localStorage.setItem(tokenKey, 'valid-token');
    (jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
      exp: Date.now() / 1000 + 3600,
    });
    expect(service.isLoggedIn()).toBe(true);
  });

  it('isLoggedIn should return false for expired token', () => {
    localStorage.setItem(tokenKey, 'expired-token');
    (jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
      exp: Date.now() / 1000 - 3600,
    });
    expect(service.isLoggedIn()).toBe(false);
  });

  it('isLoggedIn should return false if no token', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('getUsername should return username from token', () => {
    localStorage.setItem(tokenKey, 'token');
    (jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
      sub: 'testuser',
    });
    expect(service.getUsername()).toBe('testuser');
  });
});
