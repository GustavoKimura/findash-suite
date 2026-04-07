import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { guestGuard } from './guest.guard';
import { AuthService } from '../services/auth.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('guestGuard', () => {
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = { isLoggedIn: vi.fn() };
    routerMock = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('should allow activation if not logged in', () => {
    authServiceMock.isLoggedIn.mockReturnValue(false);
    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as any, {} as any),
    );
    expect(result).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should block activation and redirect to home if logged in', () => {
    authServiceMock.isLoggedIn.mockReturnValue(true);
    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as any, {} as any),
    );
    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
