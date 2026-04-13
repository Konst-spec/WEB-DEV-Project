import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from '../../../../core/models/subject.model';
import { SubjectService } from '../../../../core/services/subject';

@Component({
  selector: 'app-subjects-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './subjects-list.html',
  styleUrl: './subjects-list.css',
})
export class SubjectsList {

  private subjectService = inject(SubjectService);
  subjects$ = this.subjectService.getSubjects();

}
