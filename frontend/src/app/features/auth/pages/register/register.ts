import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../../core/services/auth';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequest } from '../../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);


  username = '';
  password = '';
  confirmPassword = '';

  error = '';
  loading = false;
  success = '';

  onSubmit() {
    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Username and password are required';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 8) {
      this.error = 'Password must be at least 8 characters long';
      return;
    }
    this.loading = true;
    this.error = '';
    this.success = '';
    const payload: RegisterRequest = {
      username: this.username,
      password: this.password
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.authService.saveTokens(res);
        this.authService.isAuthenticated.set(true);
        this.success = 'Registration successful! Redirecting to main page...';
        console.log('Tokens received:', res);
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 0);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Registration failed';
        console.error(err);
        if (err.status === 400) {
          if (err.error?.username) {
            this.error = err.error.username[0]; 
          } else if (err.error?.password) {
            this.error = err.error.password[0];
          } else {
            this.error = 'Invalid data. Please check your input';
          }
        } else if (err.status === 0) {
          this.error = 'Cannot connect to server. Is Django running?';
        } else {
          this.error = 'An unexpected server error occurred';
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
