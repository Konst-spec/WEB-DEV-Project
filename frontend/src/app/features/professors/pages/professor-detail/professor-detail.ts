import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProfessorService } from '../../../../core/services/professor';
import { ReviewService } from '../../../../core/services/review';
import { WishlistService } from '../../../../core/services/wishlist';
import { AuthService } from '../../../../core/services/auth';
import { Professor } from '../../../../core/models/professor.model';
import { Review, CreateReviewRequest } from '../../../../core/models/review.model';
import { ReviewItem } from '../../../../shared/components/review-item/review-item';
import { Subject } from '../../../../core/models/subject.model';

type FilterType = 'all' | 'positive' | 'negative';

@Component({
  selector: 'app-professor-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReviewItem],
  templateUrl: './professor-detail.html',
  styleUrl: './professor-detail.css'
})
export class ProfessorDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private professorService = inject(ProfessorService);
  private reviewService = inject(ReviewService);
  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService);

  professor = signal<Professor | null>(null);
  reviews = signal<Review[]>([]);
  subjects = signal<Subject[]>([]);

  loadingProf = signal(true);
  loadingReviews = signal(true);
  filter = signal<FilterType>('all');

  showForm = signal(false);
  submitting = signal(false);
  submitError = signal('');
  submitSuccess = signal(false);

  form = {
    subj_id: 0,
    rating: 5,
    difficulty: 3,
    text: '',
    is_anounimous: false
  };

  wishlistMessage = signal('');
  wishlistError = signal('');
  isLoggedIn = this.authService.isAuthenticated;

  get avgRating(): string {
    const r = this.reviews();
    if (!r.length) return '—';
    return (r.reduce((s, x) => s + x.rating, 0) / r.length).toFixed(1);
  }

  get avgDifficulty(): string {
    const r = this.reviews();
    if (!r.length) return '—';
    return (r.reduce((s, x) => s + x.difficulty, 0) / r.length).toFixed(1);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.professorService.getAll().subscribe({
      next: (data) => {
        const found = data.find(p => p.prof_id === id);
        if (!found) {
          this.router.navigate(['/404']);
          return;
        }

        this.professor.set(found);
        this.loadingProf.set(false);

        const prof = this.professor();
        if (prof?.subjects?.length) {
          const loaded: Subject[] = [];
          prof.subjects.forEach(subjId => {
            this.http.get<any>(`http://localhost:8000/subjects/${subjId}/`).subscribe({
              next: (s) => {
                // API returns { id, name, ... } but Subject uses subj_id
                loaded.push({ subj_id: s.id ?? s.subj_id, name: s.name, description: s.description });
                this.subjects.set([...loaded]);
              }
            });
          });
        }
      },
      error: () => this.loadingProf.set(false)
    });

    this.loadReviews(id);
  }

  loadReviews(profId: number, type?: 'positive' | 'negative'): void {
    this.loadingReviews.set(true);
    this.reviewService.getByProfessor(profId, type).subscribe({
      next: (data) => { this.reviews.set(data); this.loadingReviews.set(false); },
      error: () => this.loadingReviews.set(false)
    });
  }

  setFilter(f: FilterType): void {
    this.filter.set(f);
    const profId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadReviews(profId, f === 'all' ? undefined : f);
  }

  submitReview(): void {
    if (!this.form.subj_id) { this.submitError.set('Please select a subject'); return; }
    if (!this.form.text.trim()) { this.submitError.set('Please write your review'); return; }

    this.submitting.set(true);
    this.submitError.set('');

    const profId = Number(this.route.snapshot.paramMap.get('id'));
    const payload: CreateReviewRequest = {
      prof_id: profId,
      subj_id: this.form.subj_id,
      rating: this.form.rating,
      difficulty: this.form.difficulty,
      text: this.form.text,
      is_anounimous: this.form.is_anounimous
    };

    this.reviewService.create(payload).subscribe({
      next: () => {
        this.submitSuccess.set(true);
        this.showForm.set(false);
        this.submitting.set(false);
        this.form = { subj_id: 0, rating: 5, difficulty: 3, text: '', is_anounimous: false };
        this.loadReviews(profId);
      },
      error: (err) => {
        this.submitting.set(false);
        if (err.status === 400) {
          this.submitError.set(err.error?.non_field_errors?.[0] ?? 'Invalid data');
        } else {
          this.submitError.set('Something went wrong. Try again.');
        }
      }
    });
  }

  addToWishlist(subjId: number): void {
    const profId = Number(this.route.snapshot.paramMap.get('id'));
    this.wishlistMessage.set('');
    this.wishlistError.set('');

    if (!subjId) {
      this.wishlistError.set('Subject not loaded yet. Try again.');
      setTimeout(() => this.wishlistError.set(''), 3000);
      return;
    }

    this.wishlistService.add(profId, subjId).subscribe({
      next: () => {
        this.wishlistMessage.set('Added to wishlist!');
        setTimeout(() => this.wishlistMessage.set(''), 3000);
      },
      error: (err) => {
        console.error('Wishlist error:', err);
        if (err.status === 400) {
          this.wishlistError.set(err.error?.error ?? 'Already in wishlist');
        } else if (err.status === 401 || err.status === 403) {
          this.wishlistError.set('Please log in to use wishlist.');
        } else {
          this.wishlistError.set('Something went wrong. Try again.');
        }
        setTimeout(() => this.wishlistError.set(''), 4000);
      }
    });
  }
}
