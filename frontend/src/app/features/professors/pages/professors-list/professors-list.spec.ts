import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorsList } from './professors-list';

describe('ProfessorsList', () => {
  let component: ProfessorsList;
  let fixture: ComponentFixture<ProfessorsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessorsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
