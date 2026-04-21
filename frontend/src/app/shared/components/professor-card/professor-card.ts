import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Professor } from '../../../core/models/professor.model';

@Component({
  selector: 'app-professor-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './professor-card.html',
  styleUrl: './professor-card.css'
})
export class ProfessorCard {
  @Input() professor!: Professor;

  get initials(): string {
    return this.professor.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }
}