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
      await component.fixture.whenStable();
    }
    return component;
  }

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render the login form by default', async () => {
    await setup();
    expect(screen.getByText('Acesse sua conta FinDash')).toBeInTheDocument();
    expect(
      screen.queryByText('Crie sua conta FinDash'),
    ).not.toBeInTheDocument();
  });

  it('should switch to register view when "Registre-se" is clicked', async () => {
    await setup();
    fireEvent.click(screen.getByText('Registre-se'));
    expect(screen.getByText('Crie sua conta FinDash')).toBeInTheDocument();
  });

  it('should call authService.login and navigate on successful login', async () => {
    mockAuthService.login.mockReturnValue(of({}));
    await setup();

    fireEvent.change(screen.getByPlaceholderText('Usuário'), {
      target: { value: 'test' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(mockAuthService.login).toHaveBeenCalledWith('test', 'password');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should display an error message on failed login', async () => {
    const errorResponse = new HttpErrorResponse({
      error: { error: 'Invalid credentials' },
    });
    mockAuthService.login.mockReturnValue(throwError(() => errorResponse));
    await setup();

    fireEvent.change(screen.getByPlaceholderText('Usuário'), {
      target: { value: 'test' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should call authService.register and switch to login view on successful registration', async () => {
    mockAuthService.register.mockReturnValue(of({}));
    const { fixture } = await setup(false);

    fireEvent.change(screen.getByPlaceholderText('Usuário'), {
      target: { value: 'newuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Repita a Senha'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }));

    await fixture.whenStable();

    expect(mockAuthService.register).toHaveBeenCalledWith(
      'newuser',
      'password123',
      'password123',
    );
    expect(
      await screen.findByText('Acesse sua conta FinDash'),
    ).toBeInTheDocument();
    const usernameInput = screen.getByPlaceholderText(
      'Usuário',
    ) as HTMLInputElement;
    expect(usernameInput.value).toBe('newuser');
  });

  it('should display an error if passwords do not match on registration', async () => {
    await setup(false);

    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Repita a Senha'), {
      target: { value: 'password456' },
    });
    fireEvent.blur(screen.getByPlaceholderText('Repita a Senha'));

    expect(
      await screen.findByText('As senhas não coincidem.'),
    ).toBeInTheDocument();
  });
});
