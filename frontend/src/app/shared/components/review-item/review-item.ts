import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-review-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-item.html',
  styleUrl: './review-item.css'
})
export class ReviewItem {
  @Input() review!: Review;

  get stars(): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  get ratingClass(): string {
    if (this.review.rating >= 4) return 'positive';
    if (this.review.rating <= 2.5) return 'negative';
    return 'neutral';
  }

  get formattedDate(): string {
    return new Date(this.review.created_at).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }
}