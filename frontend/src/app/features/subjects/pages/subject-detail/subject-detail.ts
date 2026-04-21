import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SubjectService } from '../../../../core/services/subject';
import { Subject, SubjectDetail } from '../../../../core/models/subject.model';
import { ProfessorCard } from '../../../../shared/components/professor-card/professor-card';

@Component({
  selector: 'app-subject-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ProfessorCard],
  templateUrl: './subject-detail.html',
  styleUrl: './subject-detail.css'
})
export class SubjectDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private subjectService = inject(SubjectService);
  private wishlistService = inject(WishlistService);

  subject = signal<SubjectDetail | null>(null);
  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.error.set(true); return; }

    this.subjectService.getById(+id).subscribe({
      next: (data) => { this.subject.set(data); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); }
    });
  }

  isWishlisted(profId: number): boolean {
    const subj = this.subject();
    return subj ? this.wishlistService.isWishlisted(subj.id, profId) : false;
  }

  toggleWishlist(profId: number): void {
    const subj = this.subject();
    if (!subj) return;
    this.wishlistService.toggle(subj.id, subj.name, profId);
  }
}