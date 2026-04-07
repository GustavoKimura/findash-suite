import { render, screen, fireEvent } from '@testing-library/angular';
import { AuthComponent } from './auth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('AuthComponent', () => {
  const mockAuthService = {
    login: vi.fn(),
    register: vi.fn(),
  };

  const mockRouter = {
    navigate: vi.fn(),
  };

  async function setup(isLoginView = true) {
    const component = await render(AuthComponent, {
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    if (!isLoginView) {
      fireEvent.click(screen.getByText('Registre-se'));
      component.fixture.detectChanges();
      await component.fixture.whenStable();
    }
    return component;
  }

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render the login form by default', async () => {
    const { fixture } = await setup();
    const container = fixture.nativeElement.querySelector('.auth-container');
    expect(container).not.toHaveClass('is-register');
  });

  it('should switch to register view when "Registre-se" is clicked', async () => {
    const { fixture } = await setup();
    fireEvent.click(screen.getByText('Registre-se'));
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('.auth-container');
    expect(container).toHaveClass('is-register');
  });

  it('should call authService.login and navigate on successful login', async () => {
    mockAuthService.login.mockReturnValue(of({}));
    const { fixture } = await setup();

    fireEvent.input(screen.getAllByPlaceholderText('Usuário')[0], {
      target: { value: 'test' },
    });
    fireEvent.input(screen.getAllByPlaceholderText('Senha')[0], {
      target: { value: 'password' },
    });
    fixture.detectChanges();

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(mockAuthService.login).toHaveBeenCalledWith('test', 'password');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should display an error message on failed login', async () => {
    const errorResponse = new HttpErrorResponse({
      error: { error: 'Invalid credentials' },
    });
    mockAuthService.login.mockReturnValue(throwError(() => errorResponse));
    const { fixture } = await setup();

    fireEvent.input(screen.getAllByPlaceholderText('Usuário')[0], {
      target: { value: 'test' },
    });
    fireEvent.input(screen.getAllByPlaceholderText('Senha')[0], {
      target: { value: 'password' },
    });
    fixture.detectChanges();

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    fixture.detectChanges();

    expect(screen.getAllByText('Invalid credentials')[0]).toBeInTheDocument();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should call authService.register and switch to login view on successful registration', async () => {
    mockAuthService.register.mockReturnValue(of({}));
    const { fixture } = await setup(false);

    fireEvent.input(screen.getAllByPlaceholderText('Usuário')[1], {
      target: { value: 'newuser' },
    });
    fireEvent.input(screen.getAllByPlaceholderText('Senha')[1], {
      target: { value: 'password123' },
    });
    fireEvent.input(screen.getByPlaceholderText('Repita a Senha'), {
      target: { value: 'password123' },
    });
    fixture.detectChanges();

    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }));

    await fixture.whenStable();
    fixture.detectChanges();

    expect(mockAuthService.register).toHaveBeenCalledWith(
      'newuser',
      'password123',
      'password123',
    );
    const container = fixture.nativeElement.querySelector('.auth-container');
    expect(container).not.toHaveClass('is-register');

    const usernameInput = screen.getAllByPlaceholderText(
      'Usuário',
    )[0] as HTMLInputElement;
    expect(usernameInput.value).toBe('newuser');
  });

  it('should display an error if passwords do not match on registration', async () => {
    const { fixture } = await setup(false);

    fireEvent.input(screen.getAllByPlaceholderText('Senha')[1], {
      target: { value: 'password123' },
    });
    fireEvent.input(screen.getByPlaceholderText('Repita a Senha'), {
      target: { value: 'password456' },
    });
    fireEvent.blur(screen.getByPlaceholderText('Repita a Senha'));
    fixture.detectChanges();

    expect(screen.getByText('As senhas não coincidem.')).toBeInTheDocument();
  });
});
