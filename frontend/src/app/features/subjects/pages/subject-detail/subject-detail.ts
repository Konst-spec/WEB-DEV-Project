import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SubjectService } from '../../../../core/services/subject';
import { SubjectDetail } from '../../../../core/models/subject.model';

@Component({
  selector: 'app-subject-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './subject-detail.html',
  styleUrl: './subject-detail.css'
})
export class SubjectDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private subjectService = inject(SubjectService);

  subject = signal<SubjectDetail | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.subjectService.getById(id).subscribe({
      next: (data: SubjectDetail | null) => { this.subject.set(data); this.loading.set(false); },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/404']);
      }
    });
  }

  get initials(): (name: string) => string {
    return (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }
}
