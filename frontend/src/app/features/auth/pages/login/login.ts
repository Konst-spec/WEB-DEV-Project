import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginRequest } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  
  loading = false;
  error = '';
  success = '';

  onSubmit(): void {
    this.error = '';
    this.success = '';

    if (!this.username.trim()) {
      this.error = 'Username is required.';
      return;
    }

    if (!this.password.trim()) {
      this.error = 'Password is required.';
      return;
    }

    this.loading = true;

    const payload: LoginRequest = {
      username: this.username,
      password: this.password
    };

    this.authService.login(payload).subscribe({
      next: (res) => {
        this.authService.saveTokens(res);
        this.authService.isAuthenticated.set(true);
        this.success = 'Login successful! Redirecting...';
        
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 0);
      },
      error: (err) => {
        this.loading = false;
        
        if (err.status === 401) {
          this.error = 'Invalid username or password.';
        } else if (err.status === 0) {
          this.error = 'Cannot connect to server.';
        } else {
          this.error = 'Login failed. Please try again.';
        }
        
        console.error('Login error:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
