import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService, WishlistItem } from '../../../../core/services/wishlist';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './wishlist-page.html',
  styleUrl: './wishlist-page.css',
})
export class WishlistPage implements OnInit {
  private wishlistService = inject(WishlistService);

  items = signal<WishlistItem[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.loading.set(true);
    this.wishlistService.getAll().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load wishlist.');
        this.loading.set(false);
      }
    });
  }

  removeItem(id: number): void {
    this.wishlistService.remove(id).subscribe({
      next: () => {
        this.items.set(this.items().filter(i => i.id !== id));
      },
      error: () => {
        this.error.set('Failed to remove item.');
        setTimeout(() => this.error.set(''), 3000);
      }
    });
  }
}
