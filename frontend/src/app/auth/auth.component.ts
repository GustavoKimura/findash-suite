import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password');
  const repeatPassword = control.get('repeatPassword');

  if (!password || !repeatPassword || !repeatPassword.value) {
    return null;
  }

  return password.value === repeatPassword.value
    ? null
    : { passwordMismatch: true };
};

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  isLoginView = signal(true);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginPasswordVisible = signal(false);
  registerPasswordVisible = signal(false);
  registerRepeatPasswordVisible = signal(false);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  registerForm = this.fb.group(
    {
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator },
  );

  get password() {
    return this.registerForm.get('password');
  }

  get repeatPassword() {
    return this.registerForm.get('repeatPassword');
  }

  toggleLoginPasswordVisibility(): void {
    this.loginPasswordVisible.set(!this.loginPasswordVisible());
  }

  toggleRegisterPasswordVisibility(): void {
    this.registerPasswordVisible.set(!this.registerPasswordVisible());
  }

  toggleRegisterRepeatPasswordVisibility(): void {
    this.registerRepeatPasswordVisible.set(
      !this.registerRepeatPasswordVisible(),
    );
  }

  toggleView(): void {
    this.errorMessage.set(null);
    this.isLoginView.set(!this.isLoginView());
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.error?.error || 'Erro ao tentar fazer login. Tente novamente.',
        );
        this.loginForm.get('password')?.reset();
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const { username, password, repeatPassword } = this.registerForm.value;

    this.authService.register(username!, password!, repeatPassword!).subscribe({
      next: () => {
        const registeredUsername = this.registerForm.get('username')?.value;
        this.toggleView();
        this.loginForm.patchValue({ username: registeredUsername });
        this.registerForm.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.error?.error || 'Erro ao registrar. Tente novamente.',
        );
        this.registerForm.get('password')?.reset();
        this.registerForm.get('repeatPassword')?.reset();
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }
}
