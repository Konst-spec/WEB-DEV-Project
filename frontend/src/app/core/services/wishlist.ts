import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WishlistItem {
  id: number;
  professor: number;
  subject: number;
  professor_name: string;
  subject_name: string;
  professor_rating: number | null;
  added_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000';

  getAll(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(`${this.apiUrl}/wishlist/`);
  }

  add(professorId: number, subjectId: number): Observable<WishlistItem> {
    return this.http.post<WishlistItem>(`${this.apiUrl}/wishlist/`, {
      professor: professorId,
      subject: subjectId,
    });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/wishlist/?id=${id}`);
  }
}
