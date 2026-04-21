import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';

interface UserInfo {
  user_id: number;
  username: string;
}

interface ReviewItem {
  rev_id: number;
  user: number;
  professor: number;
  subject: number;
  rating: number;
  difficulty: number;
  text: string;
  created_at: string;
  is_anounimous: boolean;
}

interface ProfessorItem {
  prof_id: number;
  name: string;
}

interface SubjectItem {
  subj_id: number;
  name: string;
}

@Component({
  selector: 'app-profile-page',
  imports: [RouterLink, DatePipe],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  user = signal<UserInfo | null>(null);
  reviews = signal<ReviewItem[]>([]);
  loading = signal(true);
  reviewsError = signal('');

  // Lookup maps: id → name
  professorMap = signal<Record<number, string>>({});
  subjectMap = signal<Record<number, string>>({});

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const userInfo = this.buildUserInfo();
    if (userInfo) {
      this.user.set(userInfo);
      this.loadData(userInfo.user_id);
    } else {
      this.loading.set(false);
    }
  }

  /** Read username from localStorage (saved on login), user_id from JWT payload */
  private buildUserInfo(): UserInfo | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    let userId: number | null = null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = Number(payload.user_id ?? payload.id ?? null);
    } catch {
      return null;
    }

    if (!userId) return null;

    const username = localStorage.getItem('username') ?? `User #${userId}`;
    return { user_id: userId, username };
  }

  private loadData(userId: number): void {
    forkJoin({
      reviews: this.http.get<ReviewItem[]>('http://localhost:8000/reviews/'),
      professors: this.http.get<ProfessorItem[]>('http://localhost:8000/professors/'),
      subjects: this.http.get<SubjectItem[]>('http://localhost:8000/subjects/'),
    }).subscribe({
      next: ({ reviews, professors, subjects }) => {
        // Build lookup maps
        const profMap: Record<number, string> = {};
        professors.forEach(p => profMap[p.prof_id] = p.name);
        this.professorMap.set(profMap);

        const subjMap: Record<number, string> = {};
        subjects.forEach(s => subjMap[s.subj_id] = s.name);
        this.subjectMap.set(subjMap);

        // Filter reviews for this user
        const myReviews = reviews.filter(r => r.user === Number(userId));
        this.reviews.set(myReviews);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load data:', err);
        this.reviewsError.set(
          err.status === 401
            ? 'Session expired. Please log in again.'
            : 'Failed to load reviews.'
        );
        this.loading.set(false);
      }
    });
  }

  getProfessorName(id: number): string {
    return this.professorMap()[id] ?? `Professor #${id}`;
  }

  getSubjectName(id: number): string {
    return this.subjectMap()[id] ?? `Subject #${id}`;
  }

  logout(): void {
    this.authService.logout();
  }

  getStars(rating: number): string {
    const full = Math.round(Math.max(0, Math.min(5, rating)));
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }
}
