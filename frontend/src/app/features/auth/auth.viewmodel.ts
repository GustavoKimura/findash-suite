import { Injectable, inject, signal } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password');
  const repeatPassword = control.get('repeatPassword');
  if (!password || !repeatPassword || !repeatPassword.value) return null;
  return password.value === repeatPassword.value
    ? null
    : { passwordMismatch: true };
};

@Injectable()
export class AuthViewModel {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  public isLoginView = signal(true);
  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);

  public loginPasswordVisible = signal(false);
  public registerPasswordVisible = signal(false);
  public registerRepeatPasswordVisible = signal(false);

  public loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  public registerForm = this.fb.group(
    {
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator },
  );

  public toggleView(): void {
    this.errorMessage.set(null);
    this.isLoginView.set(!this.isLoginView());
    this.loginForm.reset();
    this.registerForm.reset();
  }

  public toggleLoginPasswordVisibility(): void {
    this.loginPasswordVisible.set(!this.loginPasswordVisible());
  }
  public toggleRegisterPasswordVisibility(): void {
    this.registerPasswordVisible.set(!this.registerPasswordVisible());
  }
  public toggleRegisterRepeatPasswordVisibility(): void {
    this.registerRepeatPasswordVisible.set(
      !this.registerRepeatPasswordVisible(),
    );
  }

  public onLogin(): void {
    if (this.loginForm.invalid) return;
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { username, password } = this.loginForm.value;
    this.authService.login(username!, password!).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Credenciais inválidas.');
      },
    });
  }

  public onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);
    const { username, password, repeatPassword } = this.registerForm.value;

    this.authService.register(username!, password!, repeatPassword!).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toggleView();
        this.loginForm.patchValue({ username });
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Erro ao registrar. Tente outro usuário.');
      },
    });
  }
}
