import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MyChallengesPopupComponent} from './my-challenges-popup.component';

describe('MyChallengesPopupComponent', () => {
  let component: MyChallengesPopupComponent;
  let fixture: ComponentFixture<MyChallengesPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyChallengesPopupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyChallengesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
