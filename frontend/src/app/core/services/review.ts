import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review, CreateReviewRequest } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000';

  getByProfessor(profId: number, type?: 'positive' | 'negative'): Observable<Review[]> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    return this.http.get<Review[]>(`${this.apiUrl}/professors/${profId}/reviews/`, { params });
  }

  create(data: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/reviews/`, data);
  }
}