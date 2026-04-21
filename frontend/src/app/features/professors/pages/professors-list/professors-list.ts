import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfessorService } from '../../../../core/services/professor';
import { ProfessorCard } from '../../../../shared/components/professor-card/professor-card';
import { Professor } from '../../../../core/models/professor.model';

@Component({
  selector: 'app-professors-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfessorCard],
  templateUrl: './professors-list.html',
  styleUrl: './professors-list.css'
})
export class ProfessorsList implements OnInit {
  private professorService = inject(ProfessorService);

  professors = signal<Professor[]>([]);
  loading = signal(true);
  searchQuery = signal('');

  filtered = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.professors();
    return this.professors().filter(p =>
      p.name.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.professorService.getAll().subscribe({
      next: (data) => { this.professors.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}