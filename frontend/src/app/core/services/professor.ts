import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Professor } from '../models/professor.model';

@Injectable({ 
  providedIn: 'root' 
})
export class ProfessorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000';

  getAll(): Observable<Professor[]> {
    return this.http.get<Professor[]>(`${this.apiUrl}/professors/`);
  }
  getById(id: number): Observable<Professor> {
  return this.http.get<Professor>(`${this.apiUrl}/professors/${id}/`);
}
}