import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoloChallengeModelComponent } from './solo-challenge-model.component';

describe('SoloChallengeModelComponent', () => {
  let component: SoloChallengeModelComponent;
  let fixture: ComponentFixture<SoloChallengeModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoloChallengeModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoloChallengeModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
