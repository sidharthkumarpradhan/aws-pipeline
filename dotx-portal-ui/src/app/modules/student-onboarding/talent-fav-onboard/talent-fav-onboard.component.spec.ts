import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentFavOnboardComponent } from './talent-fav-onboard.component';

describe('TalentFavOnboardComponent', () => {
  let component: TalentFavOnboardComponent;
  let fixture: ComponentFixture<TalentFavOnboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalentFavOnboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentFavOnboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
