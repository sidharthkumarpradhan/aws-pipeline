import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotOnBoardingQuizComponent } from './dot-on-boarding-quiz.component';

describe('DotOnBoardingQuizComponent', () => {
  let component: DotOnBoardingQuizComponent;
  let fixture: ComponentFixture<DotOnBoardingQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotOnBoardingQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotOnBoardingQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
