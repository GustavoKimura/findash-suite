import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthViewModel } from './auth.viewmodel';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [AuthViewModel],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  public vm = inject(AuthViewModel);
}
