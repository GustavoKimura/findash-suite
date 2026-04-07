import { TestBed } from '@angular/core/testing';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  const mockAuthService = {
    isLoggedIn: vi.fn(),
  };

  const mockRouter = {
    navigate: vi.fn(),
  };

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should allow activation if user is logged in', () => {
    mockAuthService.isLoggedIn.mockReturnValue(true);
    const canActivate = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState),
    );
    expect(canActivate).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should prevent activation and redirect to /auth if user is not logged in', () => {
    mockAuthService.isLoggedIn.mockReturnValue(false);
    const canActivate = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState),
    );
    expect(canActivate).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  });
});
