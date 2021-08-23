import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ChallengeWorkareaComponent} from './challenge-workarea.component';

describe('ChallengeWorkareaComponent', () => {
  let component: ChallengeWorkareaComponent;
  let fixture: ComponentFixture<ChallengeWorkareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChallengeWorkareaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeWorkareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
