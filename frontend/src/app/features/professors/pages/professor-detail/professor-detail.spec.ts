import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorDetail } from './professor-detail';

describe('ProfessorDetail', () => {
  let component: ProfessorDetail;
  let fixture: ComponentFixture<ProfessorDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessorDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
