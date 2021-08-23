import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSpotlightChallengesComponent } from './search-spotlight-challenges.component';

describe('SearchSpotlightChallengesComponent', () => {
  let component: SearchSpotlightChallengesComponent;
  let fixture: ComponentFixture<SearchSpotlightChallengesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSpotlightChallengesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSpotlightChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
