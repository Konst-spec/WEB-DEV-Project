import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorCard } from './professor-card';

describe('ProfessorCard', () => {
  let component: ProfessorCard;
  let fixture: ComponentFixture<ProfessorCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessorCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
