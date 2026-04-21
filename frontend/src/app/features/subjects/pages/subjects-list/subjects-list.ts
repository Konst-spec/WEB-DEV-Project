import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubjectService } from '../../../../core/services/subject';
import { SubjectCard } from '../../../../shared/components/subject-card/subject-card';
import { Subject } from '../../../../core/models/subject.model';

@Component({
  selector: 'app-subjects-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SubjectCard],
  templateUrl: './subjects-list.html',
  styleUrl: './subjects-list.css'
})
export class SubjectsList implements OnInit {
  private subjectService = inject(SubjectService);

  subjects = signal<Subject[]>([]);
  loading = signal(true);
  searchQuery = signal('');

  filtered = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.subjects();
    return this.subjects().filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.subjectService.getAll().subscribe({
      next: (data) => { this.subjects.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}