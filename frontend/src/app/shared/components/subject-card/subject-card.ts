import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject } from '../../../core/models/subject.model';

@Component({
  selector: 'app-subject-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './subject-card.html',
  styleUrl: './subject-card.css'
})
export class SubjectCard {
  @Input() subject!: Subject;
}