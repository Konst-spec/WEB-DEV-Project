import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubjectService } from '../../../../core/services/subject';
import { ProfessorService } from '../../../../core/services/professor';
import { SubjectCard } from '../../../../shared/components/subject-card/subject-card';
import { ProfessorCard } from '../../../../shared/components/professor-card/professor-card';
import { Subject } from '../../../../core/models/subject.model';
import { Professor } from '../../../../core/models/professor.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SubjectCard, ProfessorCard],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  private subjectService = inject(SubjectService);
  private professorService = inject(ProfessorService);

  subjects = signal<Subject[]>([]);
  professors = signal<Professor[]>([]);
  loadingSubjects = signal(true);
  loadingProfessors = signal(true);

  ngOnInit(): void {
    this.subjectService.getAll().subscribe({
      next: (data) => { this.subjects.set(data.slice(0, 6)); this.loadingSubjects.set(false); },
      error: () => this.loadingSubjects.set(false)
    });

    this.professorService.getAll().subscribe({
      next: (data) => { this.professors.set(data.slice(0, 6)); this.loadingProfessors.set(false); },
      error: () => this.loadingProfessors.set(false)
    });
  }
}