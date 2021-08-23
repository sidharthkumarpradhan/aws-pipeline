import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentsFavouritesComponent } from './talents-favourites.component';

describe('TalentsFavouritesComponent', () => {
  let component: TalentsFavouritesComponent;
  let fixture: ComponentFixture<TalentsFavouritesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalentsFavouritesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentsFavouritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
