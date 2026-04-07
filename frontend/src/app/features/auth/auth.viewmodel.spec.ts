import { TestBed } from '@angular/core/testing';
import { AuthViewModel, passwordMatchValidator } from './auth.viewmodel';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AuthViewModel', () => {
  let vm: AuthViewModel;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = {
      login: vi.fn(),
      register: vi.fn(),
    };
    routerMock = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthViewModel,
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
    vm = TestBed.inject(AuthViewModel);
  });

  it('should validate password match', () => {
    const mockFormGroup: any = {
      get: (key: string) => ({ value: key === 'password' ? '123' : '123' }),
    };
    expect(passwordMatchValidator(mockFormGroup)).toBeNull();

    const mockFormGroupFail: any = {
      get: (key: string) => ({ value: key === 'password' ? '123' : '321' }),
    };
    expect(passwordMatchValidator(mockFormGroupFail)).toEqual({
      passwordMismatch: true,
    });
  });

  it('should toggle view', () => {
    expect(vm.isLoginView()).toBe(true);
    vm.toggleView();
    expect(vm.isLoginView()).toBe(false);
  });

  it('should toggle login password visibility', () => {
    expect(vm.loginPasswordVisible()).toBe(false);
    vm.toggleLoginPasswordVisibility();
    expect(vm.loginPasswordVisible()).toBe(true);
  });

  it('should toggle register password visibility', () => {
    expect(vm.registerPasswordVisible()).toBe(false);
    vm.toggleRegisterPasswordVisibility();
    expect(vm.registerPasswordVisible()).toBe(true);
  });

  it('should toggle register repeat password visibility', () => {
    expect(vm.registerRepeatPasswordVisible()).toBe(false);
    vm.toggleRegisterRepeatPasswordVisibility();
    expect(vm.registerRepeatPasswordVisible()).toBe(true);
  });

  it('should not login if form is invalid', () => {
    vm.onLogin();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should login successfully', () => {
    vm.loginForm.setValue({ username: 'test', password: 'password' });
    authServiceMock.login.mockReturnValue(of({}));
    vm.onLogin();
    expect(authServiceMock.login).toHaveBeenCalledWith('test', 'password');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle login error', () => {
    vm.loginForm.setValue({ username: 'test', password: 'password' });
    authServiceMock.login.mockReturnValue(throwError(() => new Error()));
    vm.onLogin();
    expect(vm.errorMessage()).toBe('Credenciais inválidas.');
  });

  it('should not register if form is invalid', () => {
    vm.onRegister();
    expect(authServiceMock.register).not.toHaveBeenCalled();
  });

  it('should register successfully', () => {
    vm.registerForm.setValue({
      username: 'test',
      password: 'password',
      repeatPassword: 'password',
    });
    authServiceMock.register.mockReturnValue(of({}));
    vm.onRegister();
    expect(authServiceMock.register).toHaveBeenCalledWith(
      'test',
      'password',
      'password',
    );
    expect(vm.isLoginView()).toBe(false);
  });

  it('should handle register error', () => {
    vm.registerForm.setValue({
      username: 'test',
      password: 'password',
      repeatPassword: 'password',
    });
    authServiceMock.register.mockReturnValue(throwError(() => new Error()));
    vm.onRegister();
    expect(vm.errorMessage()).toBe('Erro ao registrar. Tente outro usuário.');
  });
});
