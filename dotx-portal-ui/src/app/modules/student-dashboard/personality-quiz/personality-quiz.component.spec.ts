import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalityQuizComponent } from './personality-quiz.component';

describe('PersonalityQuizComponent', () => {
  let component: PersonalityQuizComponent;
  let fixture: ComponentFixture<PersonalityQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalityQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalityQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
