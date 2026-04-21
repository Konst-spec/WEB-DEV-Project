import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Wishlist {
  isWishlisted(subjectId: number, professorId: number): boolean {
    return this.getWishlist().some(
      item => item.subjectId === subjectId && item.professorId === professorId
    );
  }
}
