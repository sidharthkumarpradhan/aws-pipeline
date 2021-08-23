import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotlightChallengesComponent } from './spotlight-challenges.component';

describe('SpotlightChallengesComponent', () => {
  let component: SpotlightChallengesComponent;
  let fixture: ComponentFixture<SpotlightChallengesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotlightChallengesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotlightChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
