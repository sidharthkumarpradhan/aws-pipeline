import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChallengeModelComponent } from './group-challenge-model.component';

describe('GroupChallengeModelComponent', () => {
  let component: GroupChallengeModelComponent;
  let fixture: ComponentFixture<GroupChallengeModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupChallengeModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChallengeModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
