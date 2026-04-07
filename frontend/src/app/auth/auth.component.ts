import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

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

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  registerForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    repeatPassword: ['', Validators.required],
  });

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
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;
    if (
      this.registerForm.value.password !==
      this.registerForm.value.repeatPassword
    ) {
      this.errorMessage.set('As senhas não coincidem.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const { username, password, repeatPassword } = this.registerForm.value;

    this.authService.register(username!, password!, repeatPassword!).subscribe({
      next: () => {
        this.toggleView();
        this.loginForm.patchValue({ username: username });
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.error?.error || 'Erro ao registrar. Tente novamente.',
        );
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }
}
